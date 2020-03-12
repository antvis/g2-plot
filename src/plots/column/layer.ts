import { deepMix, has, each } from '@antv/util';
import { registerPlotType } from '../../base/global';
import { LayerConfig } from '../../base/layer';
import ViewLayer, { ViewConfig } from '../../base/view-layer';
import { getGeom } from '../../geoms/factory';
import { ElementOption, ICatAxis, ITimeAxis, IValueAxis, Label, IStyleConfig } from '../../interface/config';
import ConversionTag, { ConversionTagOptions } from '../../components/conversion-tag';
import { extractScale } from '../../util/scale';
import responsiveMethods from './apply-responsive';
import './apply-responsive/theme';
import ColumnLabel from './component/label';
import * as EventParser from './event';
import './theme';

const G2_GEOM_MAP = {
  column: 'interval',
};

const PLOT_GEOM_MAP = {
  interval: 'column',
};

export interface ColumnViewConfig extends ViewConfig {
  // 图形
  type?: 'rect' | 'triangle' | 'round';
  colorField?: string;
  // 百分比, 数值, 最小最大宽度
  columnSize?: number;
  maxWidth?: number;
  minWidth?: number;
  columnStyle?: IStyleConfig | ((...args: any[]) => IStyleConfig);
  xAxis?: ICatAxis | ITimeAxis;
  yAxis?: IValueAxis;
  conversionTag?: ConversionTagOptions;
}

export interface ColumnLayerConfig extends ColumnViewConfig, LayerConfig {}

export default class BaseColumnLayer<T extends ColumnLayerConfig = ColumnLayerConfig> extends ViewLayer<T> {
  public static getDefaultOptions(): any {
    return deepMix({}, super.getDefaultOptions(), {
      xAxis: {
        visible: true,
        tickLine: {
          visible: false,
        },
        title: {
          visible: true,
        },
      },
      yAxis: {
        nice: true,
        title: {
          visible: true,
        },
        label: {
          visible: true,
        },
        grid: {
          visible: true,
        },
      },
      tooltip: {
        visible: true,
        shared: true,
        showCrosshairs: false,
        showMarkers: false,
      },
      label: {
        visible: false,
        position: 'top',
        adjustColor: true,
      },
      legend: {
        visible: true,
        position: 'top-left',
      },
      interactions: [
        { type: 'tooltip' },
        { type: 'active-region' },
        { type: 'legend-active' },
        { type: 'legend-filter' },
      ],
      conversionTag: {
        visible: false,
      },
    });
  }
  public column: any;
  public type: string = 'column';
  public conversionTag?: ConversionTag;

  public beforeInit() {
    super.beforeInit();
    /** 响应式图形 */
    if (this.options.responsive && this.options.padding !== 'auto') {
      this.applyResponsive('preRender');
    }
  }

  public afterRender() {
    const props = this.options;
    this.renderLabel();
    /** 响应式 */
    if (this.options.responsive && this.options.padding !== 'auto') {
      this.applyResponsive('afterRender');
    }
    if (props.conversionTag.visible) {
      this.conversionTag = new ConversionTag({
        view: this.view,
        field: props.yField,
        transpose: true,
        animation: props.animation === false ? false : true,
        ...props.conversionTag,
      });
    }
    super.afterRender();
  }

  protected geometryParser(dim, type) {
    if (dim === 'g2') {
      return G2_GEOM_MAP[type];
    }
    return PLOT_GEOM_MAP[type];
  }

  protected scale() {
    const { options } = this;
    const scales = {};
    /** 配置x-scale */
    scales[options.xField] = { type: 'cat' };
    if (has(options, 'xAxis')) {
      extractScale(scales[options.xField], options.xAxis);
    }
    /** 配置y-scale */
    scales[options.yField] = {};
    if (has(options, 'yAxis')) {
      extractScale(scales[options.yField], options.yAxis);
    }
    this.setConfig('scales', scales);
    super.scale();
  }

  protected coord() {}

  protected adjustColumn(column: ElementOption) {
    return;
  }

  protected addGeometry() {
    const { options } = this;
    const column = getGeom('interval', 'main', {
      positionFields: [options.xField, options.yField],
      plot: this,
    });
    if (options.conversionTag.visible) {
      this.setConfig(
        'theme',
        deepMix({}, this.getTheme(), {
          columnWidthRatio: 1 / 3,
        })
      );
    }
    this.adjustColumn(column);
    this.column = column;
    this.setConfig('geometry', column);
  }

  protected animation() {
    super.animation();
    if (this.options.animation === false) {
      /** 关闭动画 */
      this.column.animate = false;
    }
  }

  protected parseEvents(eventParser) {
    super.parseEvents(EventParser);
  }

  protected renderLabel() {
    const { scales } = this.config;
    const { yField } = this.options;
    const scale = scales[yField];
    if (this.options.label && this.options.label.visible) {
      const label = new ColumnLabel({
        view: this.view,
        plot: this,
        formatter: scale.formatter,
        ...this.options.label,
      });
      label.render();
    }
  }

  private applyResponsive(stage) {
    const methods = responsiveMethods[stage];
    each(methods, (r) => {
      const responsive = r;
      responsive.method(this);
    });
  }
}

registerPlotType('column', BaseColumnLayer);
