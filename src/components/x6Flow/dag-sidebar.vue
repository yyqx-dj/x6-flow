<template>
  <div class="dag-sidebar">
     <div 
      class="draggable"
     :class="`task-item-${node.type}`"
     v-for="(node,index) in nodeTypeList"
     :key="index"
     draggable='true'
     @dragstart="onDragStart($event,node)"
     >
      <em class="sidebar-icon" :class="'icon-' + node.type.toLowerCase()"/>
     &nbsp; &nbsp; &nbsp;
     <span>{{node.type.toUpperCase()}}</span>
     </div>
  </div>
</template>

<script>
import { nodeType } from './data.js'
export default {
  name: "sidebar",
  data() {
    return {
      nodeTypeList: nodeType,
    };
  },
  methods:{
    onDragStart(e,node){
      //  e.dataTransfer.setData("Text",e.target.id);
      this.$emit('dragstart',{e,node})
    }
  }
 
};
</script>
<style lang="scss" scoped>
.dag-sidebar{
  width: 15%;
  height: 100%;
  /* background: red; */
  border-right: 1px solid black;
  overflow-y: scroll;
}
.draggable {
  display: flex;
  width: 100%;
  height: 32px;
  margin-bottom: 10px;
  align-items: center;
  padding: 0 10px;
  border-radius: 4px;
  transform: translate(0, 0);
  box-sizing: border-box;
  cursor: move;
  font-size: 12px;
 border: 1px solid rgb(239, 239, 245);
  .sidebar-icon {
    display: block;
    width: 18px;
    height: 18px;
    background-size: 100% 100%;
    margin-right: 10px;
    &.icon-shell {
      background-image: url('./images/task-icons/shell.png');
    }
    &.icon-sub_process {
      background-image: url('./images/task-icons/sub_process.png');
    }
    &.icon-dynamic {
      background-image: url('./images/task-icons/dynamic.png');
    }
    &.icon-data_quality {
      background-image: url('./images/task-icons/data_quality.png');
    }
    &.icon-procedure {
      background-image: url('./images/task-icons/procedure.png');
    }
    &.icon-sql {
      background-image: url('./images/task-icons/sql.png');
    }
    &.icon-flink,
    &.icon-flink_stream {
      background-image: url('./images/task-icons/flink.png');
    }
    &.icon-mr {
      background-image: url('./images/task-icons/mr.png');
    }
    &.icon-python {
      background-image: url('./images/task-icons/python.png');
    }
    &.icon-dependent {
      background-image: url('./images/task-icons/dependent.png');
    }
    &.icon-http {
      background-image: url('./images/task-icons/http.png');
    }
    &.icon-datax {
      background-image: url('./images/task-icons/datax.png');
    }
    &.icon-pigeon {
      background-image: url('./images/task-icons/pigeon.png');
    }
    &.icon-sqoop {
      background-image: url('./images/task-icons/sqoop.png');
    }
    &.icon-conditions {
      background-image: url('./images/task-icons/conditions.png');
    }
    &.icon-seatunnel {
      background-image: url('./images/task-icons/seatunnel.png');
    }
    &.icon-spark {
      background-image: url('./images/task-icons/spark.png');
    }
    &.icon-switch {
      background-image: url('./images/task-icons/switch.png');
    }
    &.icon-emr {
      background-image: url('./images/task-icons/emr.png');
    }
    &.icon-zeppelin {
      background-image: url('./images/task-icons/zeppelin.png');
    }
    &.icon-hivecli {
      background-image: url('./images/task-icons/hivecli.png');
    }
    &.icon-k8s {
      background-image: url('./images/task-icons/k8s.png');
    }
    &.icon-jupyter {
      background-image: url('./images/task-icons/jupyter.png');
    }
    &.icon-mlflow {
      background-image: url('./images/task-icons/mlflow.png');
    }
    &.icon-openmldb {
      background-image: url('./images/task-icons/openmldb.png');
    }
    &.icon-dvc {
      background-image: url('./images/task-icons/dvc.png');
    }
    &.icon-java {
      background-image: url('./images/task-icons/java.png');
    }
    &.icon-dinky {
      background-image: url('./images/task-icons/dinky.png');
    }
    &.icon-sagemaker {
      background-image: url('./images/task-icons/sagemaker.png');
    }
    &.icon-chunjun {
      background-image: url('./images/task-icons/chunjun.png');
    }
    &.icon-pytorch {
      background-image: url('./images/task-icons/pytorch.png');
    }
    &.icon-dms {
      background-image: url('./images/task-icons/dms.png');
    }
    &.icon-datasync {
      background-image: url('./images/task-icons/datasync.png');
    }
    &.icon-linkis {
      background-image: url('./images/task-icons/linkis.png');
    }
    &.icon-kubeflow {
      background-image: url('./images/task-icons/kubeflow.png');
    }
    &.icon-data_factory {
      background-image: url('./images/task-icons/data_factory.png');
    }
    &.icon-remoteshell {
      background-image: url('./images/task-icons/remoteshell.png');
    }
  }

  &:hover {
    .sidebar-icon {
      &.icon-shell {
        background-image: url('./images/task-icons/shell_hover.png');
      }
      &.icon-sub_process {
        background-image: url('./images/task-icons/sub_process_hover.png');
      }
      &.icon-dynamic {
        background-image: url('./images/task-icons/dynamic_hover.png');
      }
      &.icon-data_quality {
        background-image: url('./images/task-icons/data_quality_hover.png');
      }
      &.icon-procedure {
        background-image: url('./images/task-icons/procedure_hover.png');
      }
      &.icon-sql {
        background-image: url('./images/task-icons/sql_hover.png');
      }
      &.icon-flink,
      &.icon-flink_stream {
        background-image: url('./images/task-icons/flink_hover.png');
      }
      &.icon-mr {
        background-image: url('./images/task-icons/mr_hover.png');
      }
      &.icon-python {
        background-image: url('./images/task-icons/python_hover.png');
      }
      &.icon-dependent {
        background-image: url('./images/task-icons/dependent_hover.png');
      }
      &.icon-http {
        background-image: url('./images/task-icons/http_hover.png');
      }
      &.icon-datax {
        background-image: url('./images/task-icons/datax_hover.png');
      }
      &.icon-pigeon {
        background-image: url('./images/task-icons/pigeon_hover.png');
      }
      &.icon-sqoop {
        background-image: url('./images/task-icons/sqoop_hover.png');
      }
      &.icon-conditions {
        background-image: url('./images/task-icons/conditions_hover.png');
      }
      &.icon-seatunnel {
        background-image: url('./images/task-icons/seatunnel_hover.png');
      }
      &.icon-spark {
        background-image: url('./images/task-icons/spark_hover.png');
      }
      &.icon-switch {
        background-image: url('./images/task-icons/switch_hover.png');
      }
      &.icon-emr {
        background-image: url('./images/task-icons/emr_hover.png');
      }
      &.icon-zeppelin {
        background-image: url('./images/task-icons/zeppelin_hover.png');
      }
      &.icon-hivecli {
        background-image: url('./images/task-icons/hivecli_hover.png');
      }
      &.icon-k8s {
        background-image: url('./images/task-icons/k8s_hover.png');
      }
      &.icon-jupyter {
        background-image: url('./images/task-icons/jupyter_hover.png');
      }
      &.icon-mlflow {
        background-image: url('./images/task-icons/mlflow.png');
      }
      &.icon-openmldb {
        background-image: url('./images/task-icons/openmldb_hover.png');
      }
      &.icon-dvc {
        background-image: url('./images/task-icons/dvc_hover.png');
      }
      &.icon-dinky {
        background-image: url('./images/task-icons/dinky_hover.png');
      }
      &.icon-java {
        background-image: url('./images/task-icons/java.png');
      }
      &.icon-sagemaker {
        background-image: url('./images/task-icons/sagemaker_hover.png');
      }
      &.icon-chunjun {
        background-image: url('./images/task-icons/chunjun_hover.png');
      }
      &.icon-pytorch {
        background-image: url('./images/task-icons/pytorch_hover.png');
      }
      &.icon-dms {
        background-image: url('./images/task-icons/dms_hover.png');
      }
      &.icon-datasync {
        background-image: url('./images/task-icons/datasync_hover.png');
      }
      &.icon-linkis {
        background-image: url('./images/task-icons/linkis_hover.png');
      }
      &.icon-kubeflow {
        background-image: url('./images/task-icons/kubeflow_hover.png');
      }
      &.icon-data_factory {
        background-image: url('./images/task-icons/data_factory_hover.png');
      }
      &.icon-remoteshell {
        background-image: url('./images/task-icons/remoteshell_hover.png');
      }
    }
  }

  span {
    display: flex;
    flex: 1;
  }

  .stars {
    display: flex;
    cursor: pointer;
  }
}
</style>

