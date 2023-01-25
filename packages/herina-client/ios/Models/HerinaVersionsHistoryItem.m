//
//  HerinaVersionsHistoryItem.m
//  ReactNativeNewArch70
//
//  Created by Hector Chong on 1/12/23.
//

#import "HerinaVersionsHistoryItem.h"

@implementation HerinaVersionsHistoryItem

- (instancetype)initWithDictionary:(NSDictionary *)dictionary
{
    self = [self init];

    if (self) {
        self.versionNum = dictionary[@"versionNum"];
        self.commitHash = dictionary[@"commitHash"];
        self.filePath = dictionary[@"filePath"];
    }

    return self;
}

@end
