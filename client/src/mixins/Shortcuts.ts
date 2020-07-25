import { Watch, Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';

@Component
export default class Shortcuts extends Vue {
  @Action('resetTyped', { namespace: 'shortcuts' }) private resetTyped!: Function;

  private keylog: string[] = [];

  mounted() {
    window.addEventListener('keypress', e => this.updateKeylog(e.key));
  }

  updateKeylog(key: string) {
    if (this.keylog.length > 20) this.keylog.shift();
    this.keylog.push(key.toLowerCase());
  }

  @Watch('keylog')
  watchKeylog(value: string[]) {
    const joined = value.join('');

    if (joined.slice(-5) === 'reset') {
      this.resetTyped();
    }
  }
}
