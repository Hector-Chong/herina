//
//  AppVersionConfig.m
//  ReactNativeNewArch70
//
//  Created by Hector Chong on 1/12/23.
//

#import "AppVersionConfig.h"

@implementation AppVersionConfig

- (instancetype)initWithDictionary:(NSDictionary *)dictionary
{
    self = [super init];

    if (self) {
        self.useOriginal = dictionary[@"useOriginal"];
        self.versionNum = dictionary[@"versionNum"];
        self.commitHash = dictionary[@"commitHash"];
        self.nextVersionNum = dictionary[@"nextVersionNum"];
        self.nextCommitHash = dictionary[@"nextCommitHash"];
        self.originalCommitHash = dictionary[@"originalCommitHash"];
        self.originalVersionNum = dictionary[@"originalVersionNum"];
        self.isIncrementalAvailable = dictionary[@"isIncrementalAvailable"] ? dictionary[@"isIncrementalAvailable"] : @0;
        self.isBundleAvailable = dictionary[@"isBundleAvailable"] ? dictionary[@"isBundleAvailable"] : @0;
        self.incrementalsToApply = dictionary[@"incrementalsToApply"] ? dictionary[@"incrementalsToApply"] : @[];
    }

    return self;
}

- (NSMutableDictionary *)getVersionConfigDict
{
    NSMutableDictionary *dict = [@{
                                     @"useOriginal": self.useOriginal,
                                     @"versionNum": self.versionNum,
                                     @"commitHash": self.commitHash,
                                     @"nextVersionNum": self.nextVersionNum,
                                     @"nextCommitHash": self.nextCommitHash,
                                     @"originalCommitHash": self.originalCommitHash,
                                     @"originalVersionNum": self.originalVersionNum,
                                     @"isIncrementalAvailable": self.isIncrementalAvailable,
                                     @"isBundleAvailable": self.isBundleAvailable,
                                     @"incrementalsToApply": self.incrementalsToApply
                                 } mutableCopy];

    return dict;
}

- (BOOL)shouUseOriginalBundle
{
    return [self.useOriginal isEqualToNumber:@1];
}

@end
