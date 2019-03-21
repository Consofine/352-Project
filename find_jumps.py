import numpy as np
import scipy
import scipy.signal


__all__ = ['find_jumps', 'find_jumps_fast', 'measure_dot', 'measure_cos']


def measure_dot(x, y):
    return x.dot(y)

def measure_cos(x, y):
    return 1 - scipy.spatial.distance.cosine(x, y)


def find_jumps(features, threshold=0.95, measure=measure_cos):
    '''
    Finds possible jumps with self similarity matrix.

    Input:
    - features:
        An n*m array, where n = number of frames, m = number of feature
        dimensions.
    - threshold:
        A number in range (0, 1).
    - measure:
        A function that takes 2 vectors and returns their SIMILARITY (not
        DISTANCE)

    Output:
      A list of tuples like (l, r, s), where l, r (l < r)
      represents the two ends (frame indices) of a jump, and s is the
      min-max normalized similarity.

      Result is sorted by s in descending order.
    '''
    simils = [np.array([])]
    s_min = np.inf
    s_max = -np.inf
    for i in range(1, features.shape[0]):
        simil = np.array([measure(features[i], features[j]) for j in range(i)])
        simils.append(simil)
        s_min = min(s_min, simil.min())
        s_max = max(s_max, simil.max())
    for i in range(len(simils)):
        simils[i] = (simils[i] - s_min)/(s_max - s_min)
    candidates = []
    for i in range(1, len(simils)):
        for j in range(i):
            if simils[i][j] >= threshold:
                candidates.append((j, i, simils[i][j]))
    candidates.sort(key=lambda x: x[2], reverse=True)
    return candidates


def argmax_slice(x, l, r):
    return l + np.argmax(x[l:r])

def acorr(x):
    # n: number of frames
    # m: number of feature dimensions
    n, m = x.shape
    x = x**2
    ac = np.zeros_like(x)
    for i in range(m):
        # autocorrelation over each feature dimension
        ac[:, i] = scipy.signal.correlate(x[:, i], x[:, i])[-n:] \
                / np.arange(n, 0, -1)
    ac_mean = ac.mean(axis=1)
    ac_mean /= ac_mean[0]
    return ac_mean

def find_peaks(x, reflevel):
    left = None
    rt = []
    for i in range(len(x)):
        if left is None and x[i] > reflevel:
            left = i
        elif left is not None and x[i] <= reflevel:
            if left > 0:
                rt.append(argmax_slice(x, left, i))
            left = None
    return np.array(rt)

def calc_similarity(x, interval, measure):
    return np.array([measure(x[i], x[i - interval])
                     for i in range(interval, x.shape[0])])


def find_jumps_fast(features, min_length=180, measure=measure_dot, r_len=0.5, r_simil=0.9):
    '''
    Finds possible jumps.

    This method runs faster for very large number of frames, but accuracy
    is much reduced. Consider use find_jump instead.

    Input:
    - features:
        An n*m array, where n = number of frames, m = number of feature
        dimensions.
    - min_length:
        Given in number of frames, this filters out loops that are too
        short.
    - measure:
        A function that takes 2 vectors and returns their SIMILARITY (not
        DISTANCE)
    - r_len:
        Threshold-like parameter in range (0, 1) for finding jump lengths,
        too high or too low can both reduce the number of results.
    - r_simil:
        Threshold-like parameter in range (0, 1) for finding jump points,
        too high or too low can both reduce the number of results.

    Output:
      A list of tuples like (l, r, s), where l, r (l + min_length <= r)
      represents the two ends (frame indices) of a jump, and s is the
      min-max normalized similarity.

      Result is sorted by s in descending order.
    '''
    n, m = features.shape
    # autocorrelation
    ac = acorr(features)
    #plot_sr(ac, sr)
    ps = find_peaks(ac, r_len)
    #print('#ps:', ps)
    ps = np.array([p for p in ps if p >= min_length])
    s_min = np.inf
    s_max = -np.inf
    for p in ps:
        simil = calc_similarity(fs, p, measure)
        s_min = min(s_min, simil.min())
        s_max = max(s_max, simil.max())
    candidates = []
    for p in ps:
        simil = (calc_similarity(fs, p, measure) - s_min)/(s_max - s_min)
        ts = find_peaks(simil, r_simil)
        for t in ts:
            candidates.append((t, t + p, simil[t]))
    candidates.sort(key=lambda x: x[2], reverse=True)
    return candidates
