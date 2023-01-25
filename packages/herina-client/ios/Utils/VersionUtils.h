//
//  VersionUtils.h
//  CocoaAsyncSocket
//
//  Created by Hector Chong on 1/14/23.
//

#import <Foundation/Foundation.h>

@class AppVersionConfig;

@interface VersionUtils : NSObject

+ (nonnull NSString *)getVersionJsonPath;

+ (nullable AppVersionConfig *)getVersionJson;

+ (void)setVersionKeyValue:(nonnull NSString *)key
                 value:(nonnull id)value;

+ (nullable AppVersionConfig *)createVersionJson:(nonnull NSDictionary *)params;

@end

