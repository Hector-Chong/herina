//
//  AppCapacity.m
//  ReactNativeNewArch70
//
//  Created by Hector Chong on 1/12/23.
//

#import "AppCapacity.h"
#import "Utils/VersionUtils.h"
#import "Utils/FileUtils.h"
#import "AppVersionConfig.h"
#import "HerinaVersionsHistoryItem.h"
#import "BundleManager.h"

@implementation AppCapacity

RCT_EXPORT_MODULE(Herina)

RCT_EXPORT_METHOD(initVersionJson:
                  (NSDictionary *)params
                  callback:(RCTResponseSenderBlock)callback
                  )
{
    AppVersionConfig *config = [VersionUtils createVersionJson:params];
    
    callback(@[[NSNumber numberWithBool:config==nil]]);
}

RCT_EXPORT_METHOD(getCurrentVersion:
                      (RCTResponseSenderBlock)callback
                  ) {
    AppVersionConfig *versionConfig = [VersionUtils getVersionJson];

    if (versionConfig) {
        callback(@[[NSNumber numberWithBool:NO], [versionConfig getVersionConfigDict]]);
    } else {
        callback(@[[NSNumber numberWithBool:NO]]);
    }
}

RCT_EXPORT_METHOD(recordNewestVersion:
                      (NSDictionary *)params
                      callback:(RCTResponseSenderBlock)callback
                  ) {
    NSFileManager *manager = [NSFileManager defaultManager];
    NSString *versionJsonPath = [VersionUtils getVersionJsonPath];

    NSDictionary *versionConfigDict = params;
    
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:versionConfigDict options:NSJSONWritingFragmentsAllowed error:nil];

    BOOL jsonExist = [manager fileExistsAtPath:versionJsonPath];

    NSString *plainData = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];

    NSData *dataToStore = [plainData dataUsingEncoding:NSUTF8StringEncoding];

    if (jsonExist) {
        AppVersionConfig *versionConfig = [VersionUtils getVersionJson];
                
        if(versionConfig){
            for(NSString *key in versionConfigDict){
                id value = [versionConfigDict valueForKey:key];
                
                [versionConfig setValue:value forKey:key];
            }
            
            NSMutableDictionary *newVersionDict = [versionConfig getVersionConfigDict];
            
            NSData *newData = [NSJSONSerialization dataWithJSONObject:newVersionDict options:NSJSONWritingFragmentsAllowed error:nil];

            NSFileHandle *handle = [NSFileHandle fileHandleForWritingAtPath:versionJsonPath];

            [handle seekToFileOffset:0];
            [handle writeData:newData];
            [handle truncateFileAtOffset:newData.length];
            [handle closeFile];
            
            return callback(@[[NSNumber numberWithBool:NO]]);
        }
    }

    [manager createFileAtPath:versionJsonPath contents:dataToStore attributes:nil];

    callback(@[[NSNumber numberWithBool:NO]]);
}

RCT_EXPORT_METHOD(downloadBundleToUpdate:
                      (NSDictionary *)params
                      callback:(RCTResponseSenderBlock)callback
                  ) {
    NSString *baseUrl = params[@"baseUrl"];

    NSArray<NSString *> *chunkTypes = @[@"vendor", @"main"];

    NSFileManager *manager = [NSFileManager defaultManager];

    NSString *baseStorePath = [FileUtils getBundleStoreDirPath];
    NSString *nextBundleStorePath = [baseStorePath stringByAppendingPathComponent:@"bundle.next.js"];

    if (![manager fileExistsAtPath:nextBundleStorePath]) {
        [manager createFileAtPath:nextBundleStorePath contents:nil attributes:nil];
    }

    NSFileHandle *nextBundleHandler = [NSFileHandle fileHandleForWritingAtPath:nextBundleStorePath];

    for (int i = 0; i < [chunkTypes count]; i++) {
        NSString *chunkType = [chunkTypes objectAtIndex:i];

        NSString *chunkName = [NSString stringWithFormat:@"%@.chunk.js", chunkType];
        NSString *nextChunkName = [NSString stringWithFormat:@"%@.chunk.next.js", chunkType];
        NSString *nextChunkStorePath = [baseStorePath stringByAppendingPathComponent:nextChunkName];

        NSURL *chunkUrl = [[NSURL URLWithString:baseUrl] URLByAppendingPathComponent:chunkName];

        NSError *error;

        NSData *chunkData = [NSData dataWithContentsOfURL:chunkUrl options:NSDataReadingMappedIfSafe error:&error];

        if (error) {
            return callback(@[[NSNumber numberWithBool:YES], [NSString stringWithFormat:@"%@ downloading falied.", chunkUrl]]);
        }

        if (![manager fileExistsAtPath:nextChunkStorePath]) {
            [manager createFileAtPath:nextChunkStorePath contents:chunkData attributes:nil];
        } else {
            NSFileHandle *handle = [NSFileHandle fileHandleForWritingAtPath:nextChunkStorePath];

            [handle seekToFileOffset:0];
            [handle writeData:chunkData];
            [handle truncateFileAtOffset:chunkData.length];

            [handle closeFile];
        }

        [nextBundleHandler writeData:chunkData];

        [nextBundleHandler seekToEndOfFile];
    }

    [nextBundleHandler closeFile];

    callback(@[[NSNumber numberWithBool:NO]]);
}

RCT_EXPORT_METHOD(downloadIncrementalUpdates:
                  (NSDictionary *)params
                  callback:(RCTResponseSenderBlock)callback
                  )
{
    NSString *baseUrl = params[@"baseUrl"];
    NSArray<NSDictionary *> *versionDicts = params[@"versions"];
    NSMutableArray<NSString *> *incrementals = [@[] mutableCopy];
        
    NSFileManager *manager = [NSFileManager defaultManager];
    
    for(int i=0;i<versionDicts.count;i++){
        HerinaVersionsHistoryItem *item = [[HerinaVersionsHistoryItem alloc] initWithDictionary:[versionDicts objectAtIndex:i]];
        
        NSURL *incrementalUrl = [[[NSURL URLWithString:baseUrl] URLByAppendingPathComponent:@"incremental"] URLByAppendingPathComponent:item.filePath];
    
        NSString *incrementalStorePath = [[FileUtils getIncrementalStorePath] stringByAppendingPathComponent:item.filePath];
        
        if([manager fileExistsAtPath:incrementalStorePath]){
            [manager removeItemAtPath:incrementalStorePath error:nil];
        }
        
        NSError *downloadError;
        
        NSData *incrementalData = [NSData dataWithContentsOfURL:incrementalUrl options:NSDataReadingMappedIfSafe error:&downloadError];
        
        if(downloadError){
            return callback(@[[NSNumber numberWithBool:YES], [NSString stringWithFormat:@"`%@` incremental update download failed", incrementalUrl]]);
        }
        
        [manager createFileAtPath:incrementalStorePath contents:incrementalData attributes:nil];
        
        [incrementals addObject:item.filePath];
    }
    
    [VersionUtils setVersionKeyValue:@"isIncrementalAvailable" value:@1];
    [VersionUtils setVersionKeyValue:@"incrementalsToApply" value:[incrementals reverseObjectEnumerator].allObjects];

    return callback(@[[NSNumber numberWithBool:NO]]);
}

RCT_EXPORT_METHOD(applyBundleUpdate:
                      (RCTResponseSenderBlock)callback
                  ) {
    NSFileManager *manager = [NSFileManager defaultManager];

    NSString *baseStorePath = [FileUtils getBundleStoreDirPath];
    NSString *oldBundleStorePath = [baseStorePath stringByAppendingPathComponent:@"bundle.old.js"];
    NSString *nextBundleStorePath = [baseStorePath stringByAppendingPathComponent:@"bundle.next.js"];
    NSString *bundleStorePath = [baseStorePath stringByAppendingPathComponent:@"bundle.js"];

    if (![manager fileExistsAtPath:nextBundleStorePath]) {
        callback(@[[NSNumber numberWithBool:YES], @"No downloaded bundle found. Please make sure you`ve invoked `downloadBundleToUpdate` or `requestIncrementalUpdates`."]);
    }

    NSArray<NSString *> *chunkTypes = @[@"vendor", @"main"];

    for (int i = 0; i < [chunkTypes count]; i++) {
        NSString *chunkType = [chunkTypes objectAtIndex:i];

        NSString *chunkName = [NSString stringWithFormat:@"%@.chunk.js", chunkType];
        NSString *chunkStorePath = [baseStorePath stringByAppendingPathComponent:chunkName];

        NSString *oldChunkName = [NSString stringWithFormat:@"%@.chunk.next.js", chunkType];
        NSString *oldChunkStorePath = [baseStorePath stringByAppendingPathComponent:oldChunkName];

        if ([manager fileExistsAtPath:chunkStorePath]) {
            [manager moveItemAtPath:chunkStorePath toPath:oldChunkStorePath error:nil];
        }
    }

    if ([manager fileExistsAtPath:bundleStorePath]) {
        [manager moveItemAtPath:bundleStorePath toPath:oldBundleStorePath error:nil];
    }

    [manager moveItemAtPath:nextBundleStorePath toPath:bundleStorePath error:nil];

    [VersionUtils setVersionKeyValue:@"useOriginal" value:@0];
    
    callback(@[[NSNumber numberWithBool:NO]]);
}

RCT_EXPORT_METHOD(applyIncrementalUpdate:
                  (RCTResponseSenderBlock)callback
                  )
{
    AppVersionConfig *config = [VersionUtils getVersionJson];
    
    if(!config){
        return callback(@[[NSNumber numberWithBool:YES], @"No version.json found."]);
    }
    
    if(![config.isIncrementalAvailable isEqualToNumber:@1] || [config.incrementalsToApply count] == 0){
        return callback(@[[NSNumber numberWithBool:YES], @"No incremental updates found. Make sure you've invoked `requestIncrementalUpdates`"]);
    }
    
    NSString *incrementalCode = @"";
    
    for (int i=0; i<[config.incrementalsToApply count]; i++) {
        NSString *filePath = [config.incrementalsToApply objectAtIndex:i];
        NSString *fullFilePath = [[FileUtils getIncrementalStorePath] stringByAppendingPathComponent:filePath];
        
        NSData *data = [NSData dataWithContentsOfFile:fullFilePath];
        NSString *code = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        
        incrementalCode = [incrementalCode stringByAppendingString:code];
    }
    
    NSString *insertTag = @"\"#HERINAINSERTTAG#\"";
    
    incrementalCode = [incrementalCode stringByAppendingString:insertTag];
    
    NSString *bundleCode = [BundleManager getBundleCode];
    
    bundleCode = [bundleCode stringByReplacingOccurrencesOfString:insertTag withString:incrementalCode];
        
    NSFileManager *manager = [NSFileManager defaultManager];
    
    NSString *oldBundlePath = [[FileUtils getBundleStoreDirPath] stringByAppendingPathComponent:@"old.bundle.js"];
    
    NSString *bundlePath = [[FileUtils getBundleStoreDirPath] stringByAppendingPathComponent:@"bundle.js"];
    
    if([manager fileExistsAtPath:bundlePath]){
        if([manager fileExistsAtPath:oldBundlePath]){
            [manager removeItemAtPath:oldBundlePath error:nil];
        }
        
        [manager moveItemAtPath:bundlePath toPath:oldBundlePath error:nil];
    }
    
    [manager createFileAtPath:bundlePath contents:[bundleCode dataUsingEncoding:NSUTF8StringEncoding] attributes:nil];
    
    [VersionUtils setVersionKeyValue:@"isIncrementalAvailable" value:@0];
    [VersionUtils setVersionKeyValue:@"incrementalsToApply" value:@[]];
    [VersionUtils setVersionKeyValue:@"useOriginal" value:@0];

    return callback(@[[NSNumber numberWithBool:NO]]);
}

RCT_EXPORT_METHOD(setUseOriginalBundle:
                  (NSDictionary *)params
                  callback:(RCTResponseSenderBlock)callback
                  )
{
    NSNumber *isOriginal = params[@"original"];
    
    [VersionUtils setVersionKeyValue:@"useOriginal" value:isOriginal];
    
    callback(@[[NSNumber numberWithBool:NO]]);
}

RCT_EXPORT_METHOD(reloadApp) {
    [self reloadAppViaCommand];
}

- (void)reloadAppViaCommand
{
    RCTTriggerReloadCommandListeners(@"Herina requests app reloading.");
}

@end
