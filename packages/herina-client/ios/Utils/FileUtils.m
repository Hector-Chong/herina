//
//  FileUtils.m
//  CocoaAsyncSocket
//
//  Created by Hector Chong on 1/14/23.
//

#import "FileUtils.h"

@implementation FileUtils

+ (NSString *)getHerinaDir
{
    NSFileManager *manager = [NSFileManager defaultManager];

    NSArray *dirArr = NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES);
    NSString *path = [dirArr firstObject];

    NSString *herinaDir = [path stringByAppendingPathComponent:@"Herina"];

    BOOL isDir;
    BOOL herinaDirExists = [manager fileExistsAtPath:herinaDir isDirectory:&isDir];

    if (!isDir || !herinaDirExists) {
        [manager createDirectoryAtPath:herinaDir withIntermediateDirectories:YES attributes:nil error:nil];
    }

    return herinaDir;
}

+ (NSString *)getChunkStoreDirPath:(NSString *)chunkType
{
    NSString *path = [[FileUtils getHerinaDir] stringByAppendingPathComponent:chunkType];
    
    [FileUtils createDirIfNotExists:path];

    return path;
}

+ (NSString *)getBundleStoreDirPath
{
    return [FileUtils getChunkStoreDirPath:@"bundle"];
}

+ (NSString *)getIncrementalStorePath
{
    return [FileUtils getChunkStoreDirPath:@"incremental"];
}

+ (NSString *)getAssetStorePath
{
    return [FileUtils getChunkStoreDirPath:@"assets"];
}

+ (void)createDirIfNotExists:(NSString *)path
{
    NSFileManager *manager = [NSFileManager defaultManager];
    
    BOOL isDir;
    BOOL dirExists = [manager fileExistsAtPath:path isDirectory:&isDir];

    if (!isDir || !dirExists) {
        [manager createDirectoryAtPath:path withIntermediateDirectories:YES attributes:nil error:nil];
    }
}

@end
