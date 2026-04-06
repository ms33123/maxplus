import type { App } from "vue";
import {
  ElButton,
  ElDatePicker,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElMenu,
  ElMenuItem,
  ElOption,
  ElSelect,
  ElSegmented,
  ElSubMenu,
  ElSwitch,
  ElTable,
  ElTableColumn,
  ElTag,
  ElTreeSelect
} from "element-plus";

import "element-plus/es/components/button/style/css";
import "element-plus/es/components/date-picker/style/css";
import "element-plus/es/components/dialog/style/css";
import "element-plus/es/components/form/style/css";
import "element-plus/es/components/form-item/style/css";
import "element-plus/es/components/input/style/css";
import "element-plus/es/components/input-number/style/css";
import "element-plus/es/components/message/style/css";
import "element-plus/es/components/message-box/style/css";
import "element-plus/es/components/menu/style/css";
import "element-plus/es/components/option/style/css";
import "element-plus/es/components/select/style/css";
import "element-plus/es/components/segmented/style/css";
import "element-plus/es/components/sub-menu/style/css";
import "element-plus/es/components/switch/style/css";
import "element-plus/es/components/table/style/css";
import "element-plus/es/components/table-column/style/css";
import "element-plus/es/components/tag/style/css";
import "element-plus/es/components/tree-select/style/css";

const components = [
  ElButton,
  ElDatePicker,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElMenu,
  ElMenuItem,
  ElOption,
  ElSelect,
  ElSegmented,
  ElSubMenu,
  ElSwitch,
  ElTable,
  ElTableColumn,
  ElTag,
  ElTreeSelect
];

export function installElement(app: App) {
  components.forEach((component) => {
    if (component.name) {
      app.component(component.name, component);
    }
  });
}
