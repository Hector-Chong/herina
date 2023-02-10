//
//  HerinaVersionsHistoryItem.h
//  ReactNativeNewArch70
//
//  Created by Hector Chong on 1/12/23.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface HerinaVersionsHistoryItemFileNames : NSObject

@property (nonatomic, readwrite, strong) NSString *main;

@property (nonatomic, readwrite, strong) NSString *incremental;

@property (nonatomic, readwrite, strong) NSString *vendor;

- (instancetype)initWithDictionary:(NSDictionary *)dictionary;

- (NSMutableDictionary *)getDict;

@end


@interface HerinaVersionsHistoryItem : NSObject

@property (nonatomic, readwrite, strong) NSNumber *versionNum;

@property (nonatomic, readwrite, strong) NSString *commitHash;

@property (nonatomic, readwrite, strong) NSString *lastCommitHash;

@property (nonatomic, readwrite, strong) HerinaVersionsHistoryItemFileNames *fileNames;

@property (nonatomic, readwrite, strong) NSDictionary *assets;

- (instancetype)initWithDictionary:(NSDictionary *)dictionary;

- (NSMutableDictionary *)getDict;

@end

NS_ASSUME_NONNULL_END
