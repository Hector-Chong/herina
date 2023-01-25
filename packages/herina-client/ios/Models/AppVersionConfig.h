//
//  AppVersionConfig.h
//  ReactNativeNewArch70
//
//  Created by Hector Chong on 1/12/23.
//

#import <Foundation/Foundation.h>

@interface AppVersionConfig : NSObject

@property (nonatomic, readwrite, strong) NSNumber *useOriginal;

@property (nonatomic, readwrite, strong) NSNumber *originalVersionNum;

@property (nonatomic, readwrite, strong) NSString *originalCommitHash;

@property (nonatomic, readwrite, strong) NSNumber *versionNum;

@property (nonatomic, readwrite, strong) NSString *commitHash;

@property (nonatomic, readwrite, strong) NSNumber *isIncrementalAvailable;

@property (nonatomic, readwrite, strong) NSArray<NSString *> *incrementalsToApply;

- (instancetype)initWithDictionary:(NSDictionary *)dictionary;

- (NSMutableDictionary *)getVersionConfigDict;

- (BOOL)shouUseOriginalBundle;

@end
