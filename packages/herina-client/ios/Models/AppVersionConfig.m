//
//  AppVersionConfig.m
//  ReactNativeNewArch70
//
//  Created by Hector Chong on 1/12/23.
//

#import "AppVersionConfig.h"
#import "HerinaVersionsHistoryItem.h"

@implementation AppVersionConfig

- (instancetype)initWithDictionary:(NSDictionary *)dictionary
{
    self = [super init];

    if (self) {
        self.useOriginal = [dictionary[@"useOriginal"] isEqual:@YES];
        self.versionNum = dictionary[@"versionNum"];
        self.commitHash = dictionary[@"commitHash"];
        self.nextVersionNum = dictionary[@"nextVersionNum"];
        self.nextCommitHash = dictionary[@"nextCommitHash"];
        self.originalCommitHash = dictionary[@"originalCommitHash"];
        self.originalVersionNum = dictionary[@"originalVersionNum"];
        self.isIncrementalAvailable = [dictionary[@"isIncrementalAvailable"] isEqual:@YES];
        self.isFullAvailable = [dictionary[@"isFullAvailable"] isEqual:@YES];
        self.incrementalsToApply = dictionary[@"incrementalsToApply"] ? dictionary[@"incrementalsToApply"] : @[];
        self.appliedVersionNums = dictionary[@"appliedVersionNums"] ? dictionary[@"appliedVersionNums"] : @[];
        self.fullToApply = [dictionary objectForKey:@"fullToApply"] == [NSNull null] ? [[HerinaVersionsHistoryItem alloc] initWithDictionary: dictionary[@"fullToApply"]] : nil;
    }

    return self;
}

- (NSMutableDictionary *)getVersionConfigDict
{
    NSMutableDictionary *dict = [@{
                                     @"useOriginal": @(self.useOriginal),
                                     @"versionNum": self.versionNum,
                                     @"commitHash": self.commitHash,
                                     @"nextVersionNum": self.nextVersionNum,
                                     @"nextCommitHash": self.nextCommitHash,
                                     @"originalCommitHash": self.originalCommitHash,
                                     @"originalVersionNum": self.originalVersionNum,
                                     @"isIncrementalAvailable": @(self.isIncrementalAvailable),
                                     @"isFullAvailable": @(self.isFullAvailable),
                                     @"incrementalsToApply": self.incrementalsToApply,
                                     @"appliedVersionNums": self.appliedVersionNums,
                                     @"fullToApply": self.fullToApply != nil? [self.fullToApply getDict] : [NSNull null]
                                 } mutableCopy];

    return dict;
}

@end
