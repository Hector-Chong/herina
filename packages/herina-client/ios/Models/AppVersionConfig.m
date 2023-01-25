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
        self.originalCommitHash = dictionary[@"originalCommitHash"];
        self.originalVersionNum = dictionary[@"originalVersionNum"];
        self.isIncrementalAvailable = dictionary[@"isIncrementalAvailable"] ? dictionary[@"isIncrementalAvailable"] : @0;
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
                                     @"originalCommitHash": self.originalCommitHash,
                                     @"originalVersionNum": self.originalVersionNum,
                                     @"isIncrementalAvailable": self.isIncrementalAvailable,
                                     @"incrementalsToApply": self.incrementalsToApply
                                 } mutableCopy];

    return dict;
}

- (BOOL)shouUseOriginalBundle
{
    return [self.useOriginal isEqualToNumber:@1];
}

@end
