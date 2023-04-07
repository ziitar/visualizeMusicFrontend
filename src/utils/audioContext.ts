export default class AudioContent {
  private ac;
  private analyser;
  private audioSource: MediaElementAudioSourceNode | undefined;

  constructor(fft = 64) {
    this.ac = new window.AudioContext();
    this.analyser = this.ac.createAnalyser();
    this.analyser.fftSize = fft * 2;
  }

  async changeCtxState() {
    if (this.ac.state === 'suspended') {
      await this.ac.resume();
    }
  }

  setFFT(fft: number) {
    this.analyser.fftSize = fft * 2;
  }

  connectSource(elRef: HTMLMediaElement) {
    this.audioSource = this.ac.createMediaElementSource(elRef);
    this.audioSource.connect(this.analyser);
    this.analyser.connect(this.ac.destination);
  }

  getAnalyserData() {
    if (this.audioSource) {
      const arr = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(arr);
      return arr;
    }
    return;
  }

  getFloatAnalyserData() {
    if (this.audioSource) {
      const arr = new Float32Array(this.analyser.frequencyBinCount);
      this.analyser.getFloatFrequencyData(arr);
      return arr;
    }
    return;
  }

  getAnalyserDomainData() {
    if (this.audioSource) {
      const arr = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteTimeDomainData(arr);
      return arr;
    }
    return;
  }
  getFloatAnalyserDomainData() {
    if (this.audioSource) {
      const arr = new Float32Array(this.analyser.frequencyBinCount);
      this.analyser.getFloatTimeDomainData(arr);
      return arr;
    }
    return;
  }
}
