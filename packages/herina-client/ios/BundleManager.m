//
//  BundleManager.m
//  RNHerina
//
//  Created by Hector Chong on 1/14/23.
//

#import <React/RCTBundleURLProvider.h>
#import "AppVersionConfig.h"
#import "BundleManager.h"
#import "Utils/FileUtils.h"
#import "Utils/VersionUtils.h"

@implementation BundleManager

+ (NSURL *)getBundleURL
{
#if !DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
    NSFileManager *manager = [NSFileManager defaultManager];
    NSURL *baseBundleUrl = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];

    AppVersionConfig *versionConfig = [VersionUtils getVersionJson];

    if (versionConfig && [versionConfig.useOriginal isEqualToNumber:@0]) {
        NSString *bundleDir = [FileUtils getBundleStoreDirPath];
        NSString *bundlePath = [bundleDir stringByAppendingPathComponent:@"bundle.js"];

        if ([manager fileExistsAtPath:bundlePath]) {
            return [NSURL fileURLWithPath:bundlePath];
        }
    }

    return [NSURL URLWithString:@"http://127.0.0.1:8080/bundle.js"];

//    return baseBundleUrl;

#endif /* if DEBUG */
}

+ (NSString *)getBundleCode
{
    NSURL *bundleUrl = [self getBundleURL];
    
    NSData *data = [NSData dataWithContentsOfURL:bundleUrl];
    
    return [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
}

@end
