<template>
  <div class="modal" v-if="visible">
    <div class="modal-mask"></div>
    <div class="modal-dialog" :style="{ width: width + 'px',height: height}">
      <div class="modal-content">
        <div class="modal-header">
          {{ title }}
          <span class="modal-close" @click="handleClose">×</span>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <button class="modal-confirm" @click="handleOk()">{{ okText }}</button>
          <button class="modal-cancel" @click="handleCancel">{{ cancelText }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'Modal',
  props: {
    title: {
      type: String,
      default: '提示',
    },
    visible: {
      type: Boolean,
      default: false,
    },
    okText: {
      type: String,
      default: '确认',
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    width: {
      type: Number,
      default: 350,
    },
    height: {
      type: String,
      default: 'auto',
    },
  },
  setup(props, { emit }) {
    const showModal = ref(props.visible);

    watch(
      () => props.visible,
      (val) => {
        showModal.value = val;
      }
    );

    const handleClose = () => {
      emit('update:visible');
    };

    const handleOk = () => {
      emit('confirm');
    };

    const handleCancel = () => {
      handleClose();
      emit('cancel');
    };

    return {
      showModal,
      handleClose,
      handleOk,
      handleCancel,
    };
  },
});
</script>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* z-index: 5000; */
}

.modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
}

.modal-dialog {
  overflow-y: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #f6faf9;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.modal-content {
  padding: 20px;
}

.modal-header {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 20px;
}

.modal-close {
  float: right;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
}

.modal-body {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
}

.modal-footer {
  text-align: right;
}

.modal-confirm {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background-color: #0eb17a;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  margin-right: 10px;
  cursor: pointer;
}

.modal-cancel {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}
</style>
