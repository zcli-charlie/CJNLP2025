#!/usr/bin/env python3
"""
图片压缩脚本
将指定目录下的图片压缩至 200k-300k 之间
可以通过调整质量或等比例缩放尺寸来实现
"""

import os
import sys
from PIL import Image
import io
from pathlib import Path


def get_file_size_kb(file_path):
    """获取文件大小（KB）"""
    return os.path.getsize(file_path) / 1024


def compress_image_to_target_size(input_path, output_path, min_size_kb=200, max_size_kb=300):
    """
    压缩图片到目标大小范围
    
    Args:
        input_path: 输入图片路径
        output_path: 输出图片路径
        min_size_kb: 最小文件大小（KB）
        max_size_kb: 最大文件大小（KB）
    
    Returns:
        bool: 是否成功压缩
    """
    try:
        # 打开图片
        with Image.open(input_path) as img:
            # 转换为 RGB 模式（如果是 RGBA 或其他模式）
            if img.mode in ('RGBA', 'LA', 'P'):
                # 创建白色背景
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            original_size = img.size
            original_width, original_height = original_size
            
            # 获取原始文件大小
            original_file_size = get_file_size_kb(input_path)
            
            # 如果文件已经在目标范围内，检查是否需要处理
            if min_size_kb <= original_file_size <= max_size_kb:
                print(f"  ✓ {os.path.basename(input_path)}: {original_file_size:.1f}KB (已在目标范围内)")
                return True
            
            # 如果文件小于最小值，不需要压缩
            if original_file_size < min_size_kb:
                print(f"  - {os.path.basename(input_path)}: {original_file_size:.1f}KB (小于目标范围，跳过)")
                return True
            
            # 策略1: 先尝试只调整质量
            quality = 85
            step = 5
            best_result = None
            best_size = float('inf')
            
            # 尝试不同的质量值
            for q in range(95, 40, -step):
                output_buffer = io.BytesIO()
                img.save(output_buffer, format='JPEG', quality=q, optimize=True)
                size_kb = len(output_buffer.getvalue()) / 1024
                
                if min_size_kb <= size_kb <= max_size_kb:
                    # 找到合适的大小，直接保存
                    with open(output_path, 'wb') as f:
                        f.write(output_buffer.getvalue())
                    print(f"  ✓ {os.path.basename(input_path)}: {original_file_size:.1f}KB -> {size_kb:.1f}KB (质量={q})")
                    return True
                
                # 记录最接近目标范围的结果
                if size_kb > max_size_kb and size_kb < best_size:
                    best_size = size_kb
                    best_result = output_buffer.getvalue()
            
            # 如果只调整质量无法达到目标，尝试同时调整尺寸
            if best_size > max_size_kb:
                # 计算需要缩小的比例
                # 假设文件大小与面积成正比，质量与文件大小也相关
                # 使用二分查找找到合适的缩放比例
                scale_min = 0.3
                scale_max = 1.0
                best_scale = 1.0
                best_quality = 85
                best_output = None
                
                for _ in range(10):  # 最多迭代10次
                    scale = (scale_min + scale_max) / 2
                    new_width = int(original_width * scale)
                    new_height = int(original_height * scale)
                    
                    # 确保尺寸至少为1
                    if new_width < 1 or new_height < 1:
                        break
                    
                    resized_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                    
                    # 尝试不同的质量值
                    for q in range(85, 60, -5):
                        output_buffer = io.BytesIO()
                        resized_img.save(output_buffer, format='JPEG', quality=q, optimize=True)
                        size_kb = len(output_buffer.getvalue()) / 1024
                        
                        if min_size_kb <= size_kb <= max_size_kb:
                            # 找到合适的大小
                            with open(output_path, 'wb') as f:
                                f.write(output_buffer.getvalue())
                            print(f"  ✓ {os.path.basename(input_path)}: {original_file_size:.1f}KB -> {size_kb:.1f}KB "
                                  f"(尺寸={new_width}x{new_height}, 质量={q})")
                            return True
                        
                        if size_kb <= max_size_kb:
                            # 找到了一个小于等于最大值的，记录它
                            if best_output is None or size_kb >= min_size_kb:
                                best_scale = scale
                                best_quality = q
                                best_output = output_buffer.getvalue()
                                break
                    
                    # 根据当前大小调整缩放比例
                    output_buffer = io.BytesIO()
                    resized_img.save(output_buffer, format='JPEG', quality=75, optimize=True)
                    size_kb = len(output_buffer.getvalue()) / 1024
                    
                    if size_kb > max_size_kb:
                        scale_max = scale
                    else:
                        scale_min = scale
                
                # 如果找到了最佳结果，使用它
                if best_output:
                    with open(output_path, 'wb') as f:
                        f.write(best_output)
                    final_width = int(original_width * best_scale)
                    final_height = int(original_height * best_scale)
                    final_size = len(best_output) / 1024
                    print(f"  ✓ {os.path.basename(input_path)}: {original_file_size:.1f}KB -> {final_size:.1f}KB "
                          f"(尺寸={final_width}x{final_height}, 质量={best_quality})")
                    return True
            
            # 如果还是太大，使用最接近的结果
            if best_result:
                with open(output_path, 'wb') as f:
                    f.write(best_result)
                final_size = len(best_result) / 1024
                print(f"  ⚠ {os.path.basename(input_path)}: {original_file_size:.1f}KB -> {final_size:.1f}KB "
                      f"(接近目标，质量={quality})")
                return True
            
            print(f"  ✗ {os.path.basename(input_path)}: 压缩失败")
            return False
            
    except Exception as e:
        print(f"  ✗ {os.path.basename(input_path)}: 处理出错 - {str(e)}")
        return False


def compress_directory(directory_path, min_size_kb=200, max_size_kb=300, backup=True):
    """
    压缩目录下的所有图片
    
    Args:
        directory_path: 目录路径
        min_size_kb: 最小文件大小（KB）
        max_size_kb: 最大文件大小（KB）
        backup: 是否备份原文件
    """
    directory = Path(directory_path)
    
    if not directory.exists():
        print(f"错误: 目录不存在: {directory_path}")
        return
    
    # 支持的图片格式
    image_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp'}
    
    # 获取所有图片文件
    image_files = [f for f in directory.iterdir() 
                   if f.is_file() and f.suffix.lower() in image_extensions]
    
    if not image_files:
        print(f"在目录 {directory_path} 中未找到图片文件")
        return
    
    print(f"找到 {len(image_files)} 个图片文件")
    print(f"目标大小范围: {min_size_kb}KB - {max_size_kb}KB")
    print("-" * 60)
    
    success_count = 0
    skip_count = 0
    fail_count = 0
    
    for img_file in image_files:
        # 创建备份
        if backup:
            backup_path = img_file.with_suffix(img_file.suffix + '.bak')
            if not backup_path.exists():
                import shutil
                shutil.copy2(img_file, backup_path)
        
        # 压缩图片（覆盖原文件）
        if compress_image_to_target_size(str(img_file), str(img_file), min_size_kb, max_size_kb):
            success_count += 1
        else:
            fail_count += 1
    
    print("-" * 60)
    print(f"处理完成: 成功 {success_count}, 跳过 {skip_count}, 失败 {fail_count}")


def main():
    """主函数"""
    # 默认目录
    default_directory = "/Users/tianwen/Documents/my/CJNLP2025/public/images/memory"
    
    # 从命令行参数获取目录，如果没有则使用默认目录
    if len(sys.argv) > 1:
        directory = sys.argv[1]
    else:
        directory = default_directory
    
    # 可选参数：最小和最大大小
    min_size = 200
    max_size = 300
    
    if len(sys.argv) > 2:
        min_size = int(sys.argv[2])
    if len(sys.argv) > 3:
        max_size = int(sys.argv[3])
    
    print(f"图片压缩脚本")
    print(f"目录: {directory}")
    print(f"目标大小: {min_size}KB - {max_size}KB")
    print("=" * 60)
    
    compress_directory(directory, min_size, max_size, backup=True)


if __name__ == "__main__":
    main()

