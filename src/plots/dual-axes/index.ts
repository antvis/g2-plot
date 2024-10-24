import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import { deepAssign } from '../../utils';
import { adaptor } from './adaptor';
import { DualAxesOptions } from './types';

export type { DualAxesOptions };

export class DualAxes extends Plot<DualAxesOptions> {
  /** 图表类型: 双轴图 */
  public type: string = 'dual-axes';

  /**
   * 获取 双轴图 默认配置
   */
  protected getDefaultOptions(): Partial<DualAxesOptions> {
    return deepAssign({}, super.getDefaultOptions(), {
      yAxis: [],
      syncViewPadding: true,
    });
  }

  /**
   * 获取双轴图的适配器
   */
  protected getSchemaAdaptor(): Adaptor<DualAxesOptions> {
    return adaptor;
  }

  /**
   * 覆写父类的方法
   */
  protected triggerResize() {
    if (!this.chart.destroyed) {
      // 首先自适应容器的宽高
      this.chart.forceFit(); // g2 内部执行 changeSize，changeSize 中执行 render(true)
      this.chart.clear();
      this.execAdaptor(); // 核心：宽高更新之后计算padding
      // 渲染
      this.chart.render(true);
    }
  }
}
