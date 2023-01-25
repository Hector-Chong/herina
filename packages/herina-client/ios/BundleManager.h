//
//  BundleManager.h
//  RNHerina
//
//  Created by Hector Chong on 1/14/23.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface BundleManager : NSObject

+ (NSURL *)getBundleURL;

+ (NSString *)getBundleCode;

@end

NS_ASSUME_NONNULL_END
