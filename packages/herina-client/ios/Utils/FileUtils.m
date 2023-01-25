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

+ (NSString *)getBundleStoreDirPath
{
    NSString *path = [[FileUtils getHerinaDir] stringByAppendingPathComponent:@"bundle"];
    
    [FileUtils createDirIfNotExists:path];

    return path;
}

+ (NSString *)getIncrementalStorePath
{
    NSString *path = [[FileUtils getHerinaDir] stringByAppendingPathComponent:@"incremental"];
    
    [FileUtils createDirIfNotExists:path];

    return path;
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
