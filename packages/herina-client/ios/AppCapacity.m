//
//  AppCapacity.m
//  ReactNativeNewArch70
//
//  Created by Hector Chong on 1/12/23.
//

#import "AppCapacity.h"
#import "AppVersionConfig.h"
#import "BundleManager.h"
#import "HerinaVersionsHistoryItem.h"
#import "Utils/FileUtils.h"
#import "Utils/VersionUtils.h"

@implementation AppCapacity

RCT_EXPORT_MODULE(Herina)

- (NSDictionary *)constantsToExport
{
    return @{
        @"assetsURL": [FileUtils getAssetStorePath]
    };
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

RCT_EXPORT_METHOD(initVersionJson:
                  (NSDictionary *)params
                  callback:(RCTResponseSenderBlock)callback
                  ) {
    AppVersionConfig *config = [VersionUtils createVersionJson:params];

    callback(@[[NSNumber numberWithBool:config == nil]]);
}

RCT_EXPORT_METHOD(getVersionConfig:
                  (RCTResponseSenderBlock)callback
                  ) {
    AppVersionConfig *versionConfig = [VersionUtils getVersionJson];

    if (versionConfig) {
        callback(@[[NSNumber numberWithBool:NO], [versionConfig getVersionConfigDict]]);
    } else {
        callback(@[[NSNumber numberWithBool:NO]]);
    }
}

RCT_EXPORT_METHOD(setVersionConfigValues:
                  (NSDictionary *)params
                  callback:(RCTResponseSenderBlock)callback
                  ) {
    NSFileManager *manager = [NSFileManager defaultManager];

    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:params options:NSJSONWritingFragmentsAllowed error:nil];
    NSString *plainData = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    NSData *dataToStore = [plainData dataUsingEncoding:NSUTF8StringEncoding];

    NSString *versionJsonPath = [VersionUtils getVersionJsonPath];

    AppVersionConfig *versionConfig = [VersionUtils getVersionJson];

    if (versionConfig) {
        for (NSString *key in params) {
            id value = [params valueForKey:key];

            [VersionUtils setVersionKeyValue:key value:value];
        }

        return callback(@[[NSNumber numberWithBool:NO]]);
    } else {
        [manager createFileAtPath:versionJsonPath contents:dataToStore attributes:nil];

        return callback(@[[NSNumber numberWithBool:NO]]);
    }
}

RCT_EXPORT_METHOD(downloadBundleToUpdate:
                  (NSDictionary *)params
                  callback:(RCTResponseSenderBlock)callback
                  ) {
    NSURL *baseUrl = [NSURL URLWithString:params[@"baseUrl"]];
    HerinaVersionsHistoryItem *version = [[HerinaVersionsHistoryItem alloc] initWithDictionary:params[@"version"]];
    NSArray<NSString *> *chunkTypes = @[@"vendor", @"main"];

    self.baseUrl = baseUrl;

    NSFileManager *manager = [NSFileManager defaultManager];
    
    dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
    
    __weak typeof(self) wself = self;

    dispatch_async(queue, ^{
        __strong typeof(self) strongSelf = wself;
        
        for (int i = 0; i < [chunkTypes count]; i++) {
            NSString *chunkType = [chunkTypes objectAtIndex:i];
            NSString *chunkStoreDir = [FileUtils getChunkStoreDirPath:chunkType];
            NSString *chunkName = [version.fileNames valueForKey:chunkType];
            NSString *chunkStorePath = [chunkStoreDir stringByAppendingPathComponent:chunkName];

            [FileUtils createDirIfNotExists:chunkStoreDir];

            NSURL *chunkUrl = [baseUrl URLByAppendingPathComponent:[NSString stringWithFormat:@"%@/%@", chunkType, chunkName]];

            NSError *error;

            NSData *chunkData = [NSData dataWithContentsOfURL:chunkUrl options:NSDataReadingMappedIfSafe error:&error];

            if (error) {
                return callback(@[[NSNumber numberWithBool:YES], [NSString stringWithFormat:@"%@ downloading falied.", chunkUrl]]);
            }

            if (![manager fileExistsAtPath:chunkStorePath]) {
                [manager createFileAtPath:chunkStorePath contents:chunkData attributes:nil];
            } else {
                NSFileHandle *handle = [NSFileHandle fileHandleForWritingAtPath:chunkStorePath];

                [handle seekToFileOffset:0];
                [handle writeData:chunkData];
                [handle truncateFileAtOffset:chunkData.length];

                [handle closeFile];
            }
        }

        if (version.assets != nil && [self downloadAssets:version.assets]) {
            callback(@[[NSNumber numberWithBool:NO]]);
        } else {
            callback(@[[NSNumber numberWithBool:YES], @"Assets downloading failed."]);
        }
    });
}

RCT_EXPORT_METHOD(downloadIncrementalUpdates:
                  (NSDictionary *)params
                  callback:(RCTResponseSenderBlock)callback
                  ) {
    NSURL *baseUrl = [NSURL URLWithString:params[@"baseUrl"]];
    NSArray<NSDictionary *> *versionDicts = params[@"versions"];

    self.baseUrl = baseUrl;

    NSFileManager *manager = [NSFileManager defaultManager];

    dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
    
    dispatch_async(queue, ^{
        for (int i = 0; i < [versionDicts count]; i++) {
            HerinaVersionsHistoryItem *item = [[HerinaVersionsHistoryItem alloc] initWithDictionary:[versionDicts objectAtIndex:i]];
            NSString *fileName = item.fileNames.incremental;

            NSURL *incrementalUrl = [baseUrl URLByAppendingPathComponent:[NSString stringWithFormat:@"incremental/%@", fileName]];
            NSString *incrementalStorePath = [[FileUtils getIncrementalStorePath] stringByAppendingPathComponent:fileName];

            if ([manager fileExistsAtPath:incrementalStorePath]) {
                [manager removeItemAtPath:incrementalStorePath error:nil];
            }

            NSError *downloadError;

            NSData *incrementalData = [NSData dataWithContentsOfURL:incrementalUrl options:NSDataReadingMappedIfSafe error:&downloadError];

            if (downloadError) {
                return callback(@[[NSNumber numberWithBool:YES], [NSString stringWithFormat:@"`%@` incremental update download failed", incrementalUrl]]);
            }

            [manager createFileAtPath:incrementalStorePath contents:incrementalData attributes:nil];

            if (item.assets != nil && ![self downloadAssets:item.assets]) {
                return callback(@[[NSNumber numberWithBool:YES], @"Assets downloading failed."]);
            }
        }

        return callback(@[[NSNumber numberWithBool:NO]]);
    });
}

RCT_EXPORT_METHOD(applyFullUpdate:
                  (RCTResponseSenderBlock)callback
                  ) {
    AppVersionConfig *config = [VersionUtils getVersionJson];

    if (config == nil || config.fullToApply == nil) {
        return callback(@[[NSNumber numberWithBool:YES], @"No downloaded bundle found. Please make sure you've invoked `requestFullUpdate`."]);
    }

    NSFileManager *manager = [NSFileManager defaultManager];

    NSString *baseStorePath = [FileUtils getBundleStoreDirPath];
    NSString *bundleStorePath = [baseStorePath stringByAppendingPathComponent:[NSString stringWithFormat:@"%@.js", config.nextVersionNum]];

    NSArray<NSString *> *chunkTypes = @[@"vendor", @"main"];
    NSMutableData *bundleData = [[NSMutableData alloc] init];

    for (int i = 0; i < [chunkTypes count]; i++) {
        NSString *chunkType = [chunkTypes objectAtIndex:i];

        NSString *chunkName = [config.fullToApply.fileNames valueForKey:chunkType];
        NSString *chunkStorePath = [[FileUtils getChunkStoreDirPath:chunkType] stringByAppendingPathComponent:chunkName];

        NSFileHandle *handle = [NSFileHandle fileHandleForReadingAtPath:chunkStorePath];

        [bundleData appendData:[handle readDataToEndOfFile]];

        [handle closeFile];
    }

    if ([manager fileExistsAtPath:bundleStorePath]) {
        [manager removeItemAtPath:bundleStorePath error:nil];
    }

    [manager createFileAtPath:bundleStorePath contents:bundleData attributes:nil];

    callback(@[[NSNumber numberWithBool:NO]]);
}

RCT_EXPORT_METHOD(applyIncrementalUpdate:
                  (RCTResponseSenderBlock)callback
                  ) {
    AppVersionConfig *config = [VersionUtils getVersionJson];

    if (!config) {
        return callback(@[[NSNumber numberWithBool:YES], @"`version.json` is not found."]);
    }

    if (!config.isIncrementalAvailable || [config.incrementalsToApply count] == 0) {
        return callback(@[[NSNumber numberWithBool:YES], @"No incremental updates found. Make sure you've invoked `requestIncrementalUpdates`"]);
    }

    NSMutableData *incrementalCodeData = [[NSMutableData alloc] init];

    dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_LOW, 0);

    __weak typeof(self) wself = self;

    dispatch_async(queue, ^{
        __strong typeof(self) strongSelf = wself;

        for (int i = 0; i < [config.incrementalsToApply count]; i++) {
            NSString *filePath = [config.incrementalsToApply objectAtIndex:i];
            NSString *fullFilePath = [[FileUtils getIncrementalStorePath] stringByAppendingPathComponent:filePath];

            NSData *data = [NSData dataWithContentsOfFile:fullFilePath];

            [incrementalCodeData appendData:data];
        }

        NSString *insertTag = @"\"#HERINAINSERTTAG#\"";

        NSString *incrementalCode = [[NSString alloc] initWithData:incrementalCodeData encoding:NSUTF8StringEncoding];

        incrementalCode = [incrementalCode stringByAppendingString:insertTag];

        NSString *bundleCode = [BundleManager getBundleCode];

        bundleCode = [bundleCode stringByReplacingOccurrencesOfString:insertTag withString:incrementalCode];

        NSFileManager *manager = [NSFileManager defaultManager];

        NSString *bundlePath = [[FileUtils getBundleStoreDirPath] stringByAppendingPathComponent:[NSString stringWithFormat:@"%@.js", config.nextVersionNum]];

        if ([manager fileExistsAtPath:bundlePath]) {
            [manager removeItemAtPath:bundlePath error:nil];
        }

        [manager createFileAtPath:bundlePath contents:[bundleCode dataUsingEncoding:NSUTF8StringEncoding] attributes:nil];

        callback(@[[NSNumber numberWithBool:NO]]);
    });
}

RCT_EXPORT_METHOD(setUseOriginalBundle:
                  (NSDictionary *)params
                  callback:(RCTResponseSenderBlock)callback
                  ) {
    NSNumber *isOriginal = params[@"original"];

    [VersionUtils setVersionKeyValue:@"useOriginal" value:isOriginal];

    callback(@[[NSNumber numberWithBool:NO]]);
}

RCT_EXPORT_METHOD(reloadApp) {
    [self reloadAppViaCommand];
}

- (BOOL)downloadAssets:(NSDictionary *)assets
{
    NSString *assetStoreDir = [FileUtils getAssetStorePath];
    NSArray *assetKeys = [assets allKeys];
    NSFileManager *manager = [NSFileManager defaultManager];

    for (int i = 0; i < [assetKeys count]; i++) {
        NSString *assetId = [assetKeys objectAtIndex:i];
        NSString *assetName = [assets valueForKey:assetId];
        NSString *assetStorePath = [assetStoreDir stringByAppendingPathComponent:assetName];

        NSURL *fullUrl = [self.baseUrl URLByAppendingPathComponent:[NSString stringWithFormat:@"%@/%@", @"assets", assetName]];
        NSError *error;

        NSData *data = [NSData dataWithContentsOfURL:fullUrl options:NSDataReadingMappedIfSafe error:&error];

        if (error) {
            return NO;
        }

        if ([manager fileExistsAtPath:assetStorePath]) {
            [manager removeItemAtPath:assetStorePath error:nil];
        }

        [manager createFileAtPath:assetStorePath contents:data attributes:nil];
    }

    return YES;
}

- (void)reloadAppViaCommand
{
    RCTTriggerReloadCommandListeners(@"Herina requests app reloading.");
}

@end
