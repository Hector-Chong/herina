//
//  HerinaVersionsHistoryItem.h
//  ReactNativeNewArch70
//
//  Created by Hector Chong on 1/12/23.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface HerinaVersionsHistoryItem : NSObject

@property (nonatomic, readwrite, strong) NSNumber *versionNum;

@property (nonatomic, readwrite, strong) NSString *commitHash;

@property (nonatomic, readwrite, strong) NSString *filePath;

- (instancetype)initWithDictionary:(NSDictionary *)dictionary;

@end

NS_ASSUME_NONNULL_END
