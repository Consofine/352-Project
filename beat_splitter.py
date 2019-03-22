import librosa

file_path = './audio/Call_me_maybe.wav'
audio, sr = librosa.load(file_path)
hop = 128

# not sure about params - just took from hw0
tempo, beat_frames = librosa.beat.beat_track(y=audio,
                                       sr=sr,
                                       hop_length=hop,
                                       start_bpm=120,
                                       tightness=200)
print(tempo, len(beat_frames))

beats = librosa.frames_to_samples(beat_frames, hop_length=hop)
print(len(beats))

beat_sections = []
for start, end in zip(beats, beats[1:]):
    beat_sections.append(audio[start:end])

print(beat_sections[:20])
