import sys
import numpy as np, scipy as sp, matplotlib.pyplot as plt, matplotlib, sklearn, librosa, cmath, math, random
import librosa

# GLOBALS 
HOP_LENGTH = 1024
N_FFT = 2048
SR = 22050


def get_audio(file_path):
    audio, sr = librosa.load(file_path, sr=SR)
    return audio

def get_beats(audio):
    bpm, beat_frames = librosa.beat.beat_track(y=audio,
                                               sr=SR,
                                               hop_length=HOP_LENGTH,
                                               start_bpm=120,
                                               tightness=200)
    beats = librosa.frames_to_samples(beat_frames, hop_length=HOP_LENGTH)

    return bpm, beats

def get_mfcc(audio):
    mfcc = librosa.feature.mfcc(y=audio, sr=SR)
    return mfcc

def aggregate_features(features, beats, hop_length=HOP_LENGTH, aggregation='median'):
    agg_funcs = {
        'average': np.average,
        'median': np.median
    }

    feature_matrix = np.transpose(features)
    beat_index = 0
    samples = []
    beat_features = []
    for i, f in enumerate(feature_matrix):
        starting_sample_number = HOP_LENGTH/2 * i
        if beat_index >= len(beats) - 1:
            # things wont line up exactly because of rounding error
            break
        if starting_sample_number > beats[beat_index] and starting_sample_number + HOP_LENGTH * 2 < beats[beat_index+1]:
            beat_index += 1
            # aggregate samples we've collected in this beat     
            np_samples = np.array(samples)
            aggregated = agg_funcs[aggregation](np_samples)
            beat_features.append(aggregated)
            s_length = len(samples)                
            samples = []
        samples.append(f)
    return np.array(beat_features)

def similarity_matrix(feature, metric='euclidean', cutoff=0.05):
    matrix = librosa.segment.recurrence_matrix(feature, mode='distance', metric=metric)
    shape = matrix.shape
    result = np.zeros(shape)
    cutoff_val = get_cutoff(matrix, cutoff)
    pairs = []
    for i in range(shape[0]):
        for j in range(shape[1]):
            if matrix[i, j] == 0 or matrix[i, j] > cutoff_val:
                result[i, j] = None
            else:
                result[i, j] = matrix[i, j]
                pairs.append((i, j, matrix[i, j]))
    return result, pairs

def get_cutoff(matrix, percent):
    nonzero = matrix[np.nonzero(matrix)]
    sorted_vals = np.sort(nonzero)
    size = len(sorted_vals)
    return sorted_vals[max(int(percent*size) - 1, 0)]

audio = get_audio('./audio/Call_me_maybe.wav')
bpm, beats = get_beats(audio)
mfcc = get_mfcc(audio)
agg_mfcc = aggregate_features(mfcc, beats)
sim_matrix, beat_pairs = similarity_matrix(agg_mfcc, cutoff=0.005)
print(beat_pairs)