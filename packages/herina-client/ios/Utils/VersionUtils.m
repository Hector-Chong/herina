//
//  VersionUtils.m
//  CocoaAsyncSocket
//
//  Created by Hector Chong on 1/14/23.
//

#import "VersionUtils.h"
#import "FileUtils.h"
#import "AppVersionConfig.h"

NS_ASSUME_NONNULL_BEGIN

@implementation VersionUtils

+ (NSString *)getVersionJsonPath
{
    return [[FileUtils getHerinaDir] stringByAppendingPathComponent:@"version.json"];
}

+ (void)setVersionKeyValue:(NSString *)key
                  value:(nullable id)value
{
    NSFileManager *manager = [NSFileManager defaultManager];
    NSString *path = [VersionUtils getVersionJsonPath];
    
    BOOL jsonExists = [manager fileExistsAtPath:path];
    
    if(jsonExists){
        NSData *jsonData = [NSData dataWithContentsOfFile:path];
        
        NSDictionary* dict = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingMutableContainers error:nil];
        
        [dict setValue:value forKey:key];
        
        NSData *newData = [NSJSONSerialization dataWithJSONObject:dict options:NSJSONWritingFragmentsAllowed error:nil];
        
        NSFileHandle *handle = [NSFileHandle fileHandleForWritingAtPath:path];
        
        [handle writeData:newData];
        [handle truncateFileAtOffset:newData.length];
        
        [handle closeFile];
    }
}

+ (nullable AppVersionConfig *)getVersionJson
{
    NSFileManager *manager = [NSFileManager defaultManager];
    NSString *path = [VersionUtils getVersionJsonPath];
    
    BOOL jsonExists = [manager fileExistsAtPath:path];

    if(jsonExists){
        NSData *jsonData = [NSData dataWithContentsOfFile:path];
        
        NSDictionary* dict = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingMutableContainers error:nil];
        
        return [[AppVersionConfig alloc] initWithDictionary:dict];
    }else{
        return nil;
    }
}

+ (nullable AppVersionConfig *)createVersionJson:(NSDictionary *)params
{
    NSFileManager *manager = [NSFileManager defaultManager];
    NSString *path = [VersionUtils getVersionJsonPath];
    
    if([manager fileExistsAtPath:path]){
        [manager removeItemAtPath:path error:nil];
    }
    
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:params options:NSJSONWritingFragmentsAllowed error:nil];
    
    if([manager createFileAtPath:path contents:jsonData attributes:nil]){
        return [[AppVersionConfig alloc] initWithDictionary:params];
    }else{
        return nil;
    }
}

@end

NS_ASSUME_NONNULL_END
