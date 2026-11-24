#!/bin/bash
# Prepara os takes de "Redundancia em 30 segundos" (public/p3) e "O Futuro e Agora" (public/p4).
# Uso: prep_takes_v3.sh <pasta com red/IMG_*.mov e fut/IMG_*.mov> <pasta public do projeto>
# Os takes brutos ficam no Drive (pastas "Redundância em 30 segundos" e "O futuro é agora").
set -e
SRC=$1; OUT=$2
# coloracao: contraste suave, pele protegida (menos vermelho), azul/ciano da marca mais vivos
G="curves=all='0/0 0.25/0.225 0.5/0.5 0.75/0.775 1/1',huesaturation=colors=r:saturation=-0.14:strength=1,huesaturation=colors=b+c:saturation=0.14:strength=1,colorbalance=bs=0.03:rs=-0.015:bh=-0.01,eq=saturation=1.04:gamma=1.015,unsharp=5:5:0.4"
# audio: corte de graves, reducao leve de ruido, presenca, compressao; volume fixo por trecho (-14 LUFS) com limitador
A="highpass=f=85,afftdn=nr=8:nf=-45,equalizer=f=220:t=q:w=1:g=-1.5,equalizer=f=4000:t=q:w=1.2:g=2,acompressor=threshold=-22dB:ratio=3:attack=6:release=110:makeup=2"
mk(){ # arquivo inicio duracao saida largura altura [sobra de imagem em s, com audio mudo, para transicoes]
  local in=$SRC/$1.mov ss=$2 d=$3 out=$OUT/$4.mp4 w=$5 h=$6 tail=${7:-0} tmp; tmp=$(mktemp --suffix=.wav)
  if [ -n "$ONLY" ] && [ "$ONLY" != "$4" ]; then return; fi
  local vd; vd=$(python3 -c "print(round($d + $tail, 4))")
  ffmpeg -v error -y -ss $ss -t $d -i "$in" -vn -ac 1 -ar 48000 -af "$A" "$tmp"
  local I; I=$(ffmpeg -i "$tmp" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}')
  local gain; gain=$(python3 -c "print(round(-14.0 - ($I), 2))")
  local fo; fo=$(python3 -c "print(round($d - 0.03, 3))")
  ffmpeg -v error -y -ss $ss -t $vd -i "$in" -i "$tmp" -map 0:v -map 1:a \
    -vf "scale=$w:$h:flags=lanczos,fps=30,$G,format=yuv420p" \
    -af "volume=${gain}dB,alimiter=limit=0.84:level=false,afade=t=in:d=0.02,afade=t=out:st=$fo:d=0.03,apad=pad_dur=$tail" \
    -c:v libx264 -crf 18 -preset medium -c:a aac -b:a 192k -ar 48000 "$out"
  rm -f "$tmp"; echo "$4 I=$I ganho=${gain}dB $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out")s"
}
# Redundancia (1440x2560): abertura dividida em pergunta e resposta para tirar o silencio entre elas
mk red/IMG_8064 2.15 3.2    p3/t1a 1440 2560
mk red/IMG_8064 5.68 2.2667 p3/t1b 1440 2560
mk red/IMG_8071 1.27 9.7    p3/t2  1440 2560
mk red/IMG_8073 1.39 8.0    p3/t3  1440 2560
mk red/IMG_8075 1.34 8.3    p3/t4  1440 2560
# O Futuro e Agora (1620x2880)
mk fut/IMG_8051 1.21 4.0667 p4/t1  1620 2880 0.6
mk fut/IMG_8055 2.28 7.0667 p4/t2  1620 2880
