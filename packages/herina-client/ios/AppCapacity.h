//
//  AppCapacity.h
//  ReactNativeNewArch70
//
//  Created by Hector Chong on 1/12/23.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTReloadCommand.h>
#import <React/RCTBridge.h>

@class AppVersionConfig;

@interface AppCapacity : NSObject <RCTBridgeModule>

@property(nonatomic, readwrite, copy) NSURL *baseUrl;

- (BOOL)downloadAssets:(NSDictionary *)assets;

@end
