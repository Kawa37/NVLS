import os

while True:
    default_res = 360
    url = input(' URL: ').strip()
    if url.lower() == "q":
        break

    try:
        res = input(f' RES[{default_res}]: ').strip()
        if res == "q":break
        res = int(res) if res else default_res
    except Exception as e:
        print(' Error:', e)
        continue

    command = fr'yt-dlp -o "\\wsl.localhost\Ubuntu-22.04\home\kaiika\.vids\%(title)s.%(ext)s" -f "bestvideo[ext=mp4][vcodec^=avc1][height<={res}]+bestaudio[ext=m4a]/best[ext=mp4][vcodec^=avc1]" {url}'


    try:
        os.system(command)
    except Exception as e:
        print(' ERR:', e)
