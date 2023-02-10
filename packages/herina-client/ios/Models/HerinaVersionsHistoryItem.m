//
//  HerinaVersionsHistoryItem.m
//  ReactNativeNewArch70
//
//  Created by Hector Chong on 1/12/23.
//

#import "HerinaVersionsHistoryItem.h"

@implementation HerinaVersionsHistoryItemFileNames

- (instancetype)initWithDictionary:(NSDictionary *)dictionary
{
    self = [super init];
    
    if(self){
        self.main = dictionary[@"main"];
        self.incremental = dictionary[@"incremental"];
        self.vendor = dictionary[@"vendor"];
    }
    
    return self;
}

- (NSMutableDictionary *)getDict
{
    return [@{
        @"main": _main,
        @"incremental": _incremental,
        @"vendor": _vendor
    } mutableCopy];
}

@end

@implementation HerinaVersionsHistoryItem

- (instancetype)initWithDictionary:(NSDictionary *)dictionary
{
    self = [self init];

    if (self) {
        self.versionNum = dictionary[@"versionNum"];
        self.commitHash = dictionary[@"commitHash"];
        self.lastCommitHash = dictionary[@"lastCommitHash"];
        self.fileNames = [[HerinaVersionsHistoryItemFileNames alloc] initWithDictionary:dictionary[@"fileNames"]];
        self.assets = dictionary[@"assets"]; 
    }

    return self;
}

- (NSMutableDictionary *)getDict
{
    return [@{
        @"versionNum": _versionNum,
        @"commitHash": _commitHash,
        @"lastCommitHash": _lastCommitHash,
        @"fileNames": [_fileNames getDict],
        @"assets": _assets,
    } mutableCopy];
}

@end
