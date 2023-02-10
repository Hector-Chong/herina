//
//  AppVersionConfig.h
//  ReactNativeNewArch70
//
//  Created by Hector Chong on 1/12/23.
//

#import <React/RCTConvert.h>

@class HerinaVersionsHistoryItem;

@interface AppVersionConfig : NSObject

@property (nonatomic, assign) BOOL useOriginal;

@property (nonatomic, readwrite, strong) NSNumber *originalVersionNum;

@property (nonatomic, readwrite, strong) NSString *originalCommitHash;

@property (nonatomic, readwrite, strong) NSNumber *versionNum;

@property (nonatomic, readwrite, strong) NSString *commitHash;

@property (nonatomic, readwrite, strong) NSNumber *nextVersionNum;

@property (nonatomic, readwrite, strong) NSString *nextCommitHash;

@property (nonatomic, assign) BOOL isIncrementalAvailable;

@property (nonatomic, assign) BOOL isFullAvailable;

@property (nonatomic, readwrite, strong) NSArray<NSString *> *incrementalsToApply;

@property (nonatomic, readwrite, strong) HerinaVersionsHistoryItem *fullToApply;

@property (nonatomic, readwrite, strong) NSArray<NSNumber *>* appliedVersionNums;

- (instancetype)initWithDictionary:(NSDictionary *)dictionary;

- (NSMutableDictionary *)getVersionConfigDict;

@end
