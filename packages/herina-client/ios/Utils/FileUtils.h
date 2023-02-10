//
//  FileUtils.h
//  CocoaAsyncSocket
//
//  Created by Hector Chong on 1/14/23.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface FileUtils : NSObject

+ (NSString *)getHerinaDir;

+ (NSString *)getBundleStoreDirPath;

+ (NSString *)getChunkStoreDirPath:(NSString *)chunkType;

+ (NSString *)getIncrementalStorePath;

+ (NSString *)getAssetStorePath;

+ (void)createDirIfNotExists:(NSString *)path;

@end

NS_ASSUME_NONNULL_END
