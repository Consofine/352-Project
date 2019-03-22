from flask import Flask, request
import sys
import IPython, numpy as np, scipy as sp, matplotlib.pyplot as plt, matplotlib, sklearn, cmath, math, random
from infinite_jukebox import *

app = Flask(__name__)

# GLOBALS 
HOP_LENGTH = 1024
N_FFT = 2048
AVAILABLE_SONGS = {
    'Call_Me_Maybe': '/audio/Call_me_maybe.wav'
}

@app.route('/infinitejukebox/<song>')
def home(song):
    audio = get_audio(AVAILABLE_SONGS[song])
    bpm, beats = get_beats(audio)
    mfcc = get_mfcc(audio)
    agg_mfcc = aggregate_features(mfcc, beats)
    sim_matrix, beat_pairs = similarity_matrix(agg_mfcc)
    return beat_pairs