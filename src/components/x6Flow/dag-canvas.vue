<template>
  <div
    class="dag-canvas"
    @drop="this.handleDrop"
    @dragenter="this.handlePreventDefault"
    @dragover="this.handlePreventDefault"
    @dragleave="this.handlePreventDefault"
  >
    <div id="container"></div>
    <div id="minimap"></div>

    <dag-context-menu
      :visible="nodeVariables.menuVisible"
      :left="nodeVariables.pageX"
      :top="nodeVariables.pageY"
      @copyTask="copyTask"
      @remove="remove"
      @edit="edit"
    />

    <dag-node-data-modal
      ref="nodeDataModal"
      :visible="nodeinfo.visible"
      :flag="nodeinfo.flag"
      @addSubmit="onAddSubmit"
    />
  </div>
</template>

<script>
import { Graph, Shape } from "@antv/x6";
import { DagreLayout, GridLayout } from "@antv/layout";
import { nanoid } from "nanoid";
import { NODE, EDGE, X6_NODE_NAME, X6_EDGE_NAME,truncateText } from "./dag-config";
import { updateCellStyle } from "./cell-active";
import tl from "./img/tl.png";
import antv from "./img/antv.png";
import shell from './images/task-icons/shell.png'
import ContextMenuTool from "./dag-context-menu";
import dagNodeDataModalVue from "./dag-node-data-modal.vue";
import { DataUri } from "@antv/x6";
// import { useFullscreen } from "@vueuse/core";
import dagre from "dagre";
import './x6-style.css'

// const { isFullscreen, toggle } = useFullscreen();
const DEFAULT_LAYOUT_CONFIG = {
  cols: 0,
  nodesep: 50,
  padding: 50,
  ranksep: 50,
  rows: 0,
  type: "dagre",
};
// 布局方向
const dir = "LR"; // LR RL TB BT
const data = {
  nodes: [
    {
      id: "node1",
      shape: "dag-node",
      data: {
        name: "节点1",
        iconUrl: tl,
        type: "1",
      },
      attrs: {
        title: {
          text: "节点1",
        },
        image: {
          "xlink:href": tl,
        },
      },
    },
    {
      id: "node2",
      shape: "dag-node",

      data: {
        name: "节点2",
        iconUrl: tl,
        type: "2",
      },
      attrs: {
        title: {
          text: "节点2",
        },
        image: {
          "xlink:href": tl,
        },
      },
    },
    {
      id: "node3",
      shape: "dag-node",

      data: {
        name: "节点3",
        iconUrl: tl,
        type: "3",
      },
      attrs: {
        title: {
          text: "节点3",
        },
        image: {
          "xlink:href": tl,
        },
      },
    },
  ],
  edges: [
    {
      shape: "dag-edge",
      source: "node1",
      target: "node2",
      // label: "x6",
      attrs: {
        // line 是选择器名称，选中的边的 path 元素
        line: {
          stroke: "#8f8f8f",
          strokeWidth: 1,
        },
      },
    },
    {
      shape: "dag-edge",
      source: "node2",
      target: "node3",
      // label: "x6",
      attrs: {
        // line 是选择器名称，选中的边的 path 元素
        line: {
          stroke: "#8f8f8f",
          strokeWidth: 1,
        },
      },
    },
  ],
};

export default {
  name: "dag-canvas",
  props: ["addNodeItem", "layoutFormValue", "searchSelectValue", "flag"],
  components: {
    "dag-context-menu": ContextMenuTool,
    "dag-node-data-modal": dagNodeDataModalVue,
  },
  data() {
    return {
      graph: null,
      hoverCell: {},
      nodeVariables: {
        menuCell: "",
        pageX: "",
        pageY: "",
        menuVisible: false,
      },
      nodePosition: {
        x: 0,
        y: 0,
      },
      nodeinfo: {
        visible: false,
        flag: "add",
      },
    };
  },
  mounted() {
    document.addEventListener("click", () => {
      this.hide();
    });
    // Graph.registerNodeTool('contextmenu', ContextMenuTool, true)
    this.graph = this.initGraph();
    // // Make sure the edge starts with node, not port
    this.graph.on("edge:connected", ({ isNew, edge }) => {
      console.log("edge", edge);
      if (isNew) {
        const sourceNode = edge.getSourceNode();
        edge.setSource(sourceNode);
      }
    });

    // hover
    this.graph.on("cell:mouseenter", (data) => {
      const { cell, e } = data;
      // if (!isStatusIcon(e.target.tagName)) {
      this.hoverCell.value = cell;
      updateCellStyle(this.graph, cell, this.hoverCell);
      // }
    });
    this.graph.on("cell:mouseleave", ({ cell }) => {
      this.hoverCell.value = undefined;
      updateCellStyle(this.graph, cell, this.hoverCell);
    });

    // select
    this.graph.on("cell:selected", ({ cell }) => {
      updateCellStyle(this.graph, cell, this.hoverCell);
    });
    this.graph.on("cell:unselected", ({ cell }) => {
      updateCellStyle(this.graph, cell, this.hoverCell);
    });

    // Add a node tool when the mouse entering
    this.graph.on("node:mouseenter", ({ node }) => {
      const nodeName = node.getData().name;
      const markup = node.getMarkup();
      const fo = markup.filter((m) => m.tagName === "foreignObject")[0];
      node.addTools({
        name: "button",
        args: {
          markup: [
            {
              tagName: "text",
              textContent: nodeName,
              attrs: {
                fill: "#868686",
                "font-size": 16,
                "text-anchor": "center",
              },
            },
          ],
          x: 0,
          y: 0,
          offset: { x: 0, y: fo ? -28 : -10 },
        },
      });
    });

    // Remove all tools when the mouse leaving
    this.graph.on("node:mouseleave", ({ node }) => {
      node.removeTool("button");
    });

    this.graph.on("node:click", ({ node }) => {
      console.log("单击节点", node);
      const nodes = this.graph.getNodes();
      const edges = this.graph.getEdges();
      const data = node.getData();
      // nodes.forEach((n) => {
      //   let icon = n.getAttrs().image["xlink:href"];
      //   if (n.id === node.id) {
      //     n.attr("body/stroke", "#1890ff");
      //     n.attr("title/fill", "#1890ff");
      //     n.attr("image/xlink:href", antv);
      //   } else {
      //     n.attr("body/stroke", "#ccc");
      //     n.attr("title/fill", "#333");
      //     n.attr("image/xlink:href", data.iconUrl);
      //   }
      // });

      edges.forEach((edge) => {
        console.log("3", edge.getTargetNode());
        if (edge.getTargetNode().id === node.id) {
          edge.attr("line/stroke", "#1890ff");
          edge.attr("line/targetMarker/fill", "#1890ff");
        } else {
          edge.attr("line/stroke", "#A2B1C3");
          edge.attr("line/targetMarker/fill", "#A2B1C3");
        }
      });
    });
    this.graph.on("node:contextmenu", ({ cell, x, y }) => {
      console.log('右键cell',cell)
      this.nodeVariables.menuCell = cell;
      const data = this.graph.localToPage(x, y);
      this.nodeVariables.pageX = data.x;
      this.nodeVariables.pageY = data.y;

      // show menu
      this.nodeVariables.menuVisible = true;

      // lock scroller
      this.graph.lockScroller();
    });

    this.registerCustomCells();

    //
    // this.graph.fromJSON(data); // 渲染元素
    // this.format();
    // this.graph.zoomTo(0.7);
    // this.graph.centerContent();
  },
  methods: {
    //拖拽生成新节点modal
    onAddSubmit(values) {
      if (this.nodeinfo.flag === "add") {
        if (values) {
          let nodeData = { ...values,type: this.addNodeItem.type };
          let data = { ...this.addNodeItem, data: nodeData };
          this.$emit("handleEditNodeItem", data);
          this.$nextTick(() => {
            this.handleDropAddNode();
            this.nodeinfo.visible = false;
          });
        } else {
          this.nodeinfo.visible = false;
        }
         this.$refs.nodeDataModal.form.resetFields();
      } else if (this.nodeinfo.flag === "edit") {
        if(values){
          const node = this.nodeVariables.menuCell;  //右键的节点
          if (node) {
            node.setData({ name: values.name });  //更新业务信息
            node.attr('title/text', truncateText(values.name,18))
          }
        }
       
         this.nodeinfo.visible = false;
         this.$refs.nodeDataModal.form.resetFields();
         this.nodeinfo.flag = "add"
      }
     
    },
    onAddNodeModalShow() {
      this.nodeinfo.visible = true;
    },
    //点击画布任意处隐藏右键菜单
    hide() {
      this.nodeVariables.menuVisible = false;
      // unlock scroller
      this.graph.value?.unlockScroller();
    },
    //初始化画布
    initGraph() {
      return new Graph({
        container: document.getElementById("container"),
        selecting: {
          //框选
          enabled: true,
          multiple: true,
          rubberband: true,
          rubberEdge: true,
          movable: true,
          showNodeSelectionBox: false,
        },
        scaling: {
          min: 0.2,
          max: 2,
        },
        mousewheel: {
          //画布缩放
          enabled: true,
          modifiers: ["ctrl", "meta"],
        },
        // panning: true, //拖拽画布

        grid: {
          //网格背景
          size: 10,
          visible: true,
        },
        snapline: true, //对齐线
        scroller: true, //和panning不可同时用，冲突
        minimap: {
          enabled: true,
          container: document.getElementById("minimap"),
          scalable: true,
          width: 250,
          height: 150,
        },
        //interacting 来启动、禁用一些元素的交互行为，如果画布上元素纯预览，不能进行任何交互，可以直接设置为 false。
        interacting: {
          edgeLabelMovable: false, //边的标签是否可以被移动
          nodeMovable: true, //节点是否可以被移动。
          magnetConnectable: true, //在具有 magnet 属性的元素上按下鼠标开始拖动时，是否触发连线交互
        },
        connecting: {
          // 是否允许在相同的起始节点和终止之间创建多条边，默认为 true。
          allowMulti: false,
          //是否允许连接到画布空白位置的点，默认为 true
          allowBlank: false,
          // 是否允许创建循环连线，即边的起始节点和终止节点为同一节点，默认为 true。
          allowLoop: false,
          // 是否允许边连接到另一个边，默认为 true
          allowEdge: false,
          // 是否允许边连接到节点（非节点上的连接桩），默认为 true
          allowNode: true,
          // 是否允许边连接到连接桩，默认为 true。
          allowPort: false,
          // Whether all available ports or nodes are highlighted when you drag the edge
          highlight: true,
          createEdge() {
            return this.graph?.createEdge({
              shape: X6_EDGE_NAME,
            });
          },

          //validateConnection：在移动边的时候判断连接是否有效，如果返回 false，当鼠标放开的时候，不会连接到当前元素，常常配合高亮功能一起使用。
          validateConnection(data) {
            const { sourceCell, targetCell } = data;
            if (
              sourceCell &&
              targetCell &&
              sourceCell.isNode() &&
              targetCell.isNode()
            ) {
              const sourceData = sourceCell.getData();
              if (!sourceData) return true;
              if (sourceData.taskType !== "CONDITIONS") return true;
              const edges = graph?.getConnectedEdges(sourceCell);
              if (!edges || edges.length < 2) return true;
              let len = 0;
              return !edges.some((edge) => {
                if (edge.getSourceCellId() === sourceCell.id) {
                  len++;
                }
                return len > 2;
              });
            }

            return true;
          },
          validateEdge({ edge }) {
            const sourceData = edge.getSourceNode()?.getData();
            const targetData = edge.getTargetNode()?.getData();
            edge?.setAttrs({
              line: {
                //虚线
                strokeDasharray:
                  sourceData.taskExecuteType === "STREAM" ||
                  targetData.taskExecuteType === "STREAM"
                    ? "5 5"
                    : "none",
              },
            });
            return true;
          },
        },
        highlighting: {
          //连线过程中，节点可以被链接时被使用
          nodeAvailable: {
            name: "className",
            args: {
              className: "available",
            },
          },
          // 连线过程中，连接桩可以被链接时被使用.连接桩可以被连接时在连接桩外围围渲染一个包围框
          magnetAvailable: {
            name: "className",
            args: {
              className: "available",
            },
          },
          // 连线过程中，自动吸附到连接桩时被使用。连接桩吸附连线时在连接桩外围围渲染一个包围框
          magnetAdsorbed: {
            name: "className",
            args: {
              className: "adsorbed",
            },
          },
        },
      });
    },
    handlePreventDefault(e) {
      e.preventDefault();
    },

    //创建节点
    createNode(type, graph, position, nodeItem) {
      if (!graph) {
        return {};
      }
      let newNode = {};
      const sameTypeNodes = graph
        .getNodes()
        .filter((item) => item.getData()?.type === type);
      const id = nanoid();
      const node = {
        id,
        shape: X6_NODE_NAME,
        x: position?.x,
        y: position?.y,
        data: { ...nodeItem.data },
        attrs: {
          title: {
            text: truncateText(nodeItem.data.name,18),
          },
          image: {
            'xlink:href': `${
            window.location.origin
            }${window.location.pathname}images/task-icons/${(type !== ('FLINK_STREAM')
            ? type
            : 'FLINK'
          ).toLocaleLowerCase()}.png`
          },
        },
      };
      newNode = graph.addNode(node);
      return newNode;
    },
    //节点拖拽结束
    handleDrop(e) {
      console.log(e);
      e.preventDefault();
      const { x, y } = this.graph.clientToLocal(e.clientX, e.clientY);
      this.nodePosition.x = x;
      this.nodePosition.y = y;
      // this.createNode(
      //   this.addNodeItem.type,
      //   this.graph,
      //   { x, y },
      //   this.addNodeItem
      // );
      this.onAddNodeModalShow();
    },
    //
    handleDropAddNode() {
      this.createNode(
        this.addNodeItem.type,
        this.graph,
        this.nodePosition,
        this.addNodeItem
      );
    },
    //注册边/节点
    registerCustomCells() {
      Graph.unregisterNode(X6_NODE_NAME);
      Graph.unregisterEdge(X6_EDGE_NAME);
      Graph.registerNode(X6_NODE_NAME, { ...NODE });
      Graph.registerEdge(X6_EDGE_NAME, { ...EDGE });
    },

    // 自动布局
    // layout() {
    //   const nodes = this.graph.getNodes();
    //   const edges = this.graph.getEdges();
    //   const g = new dagre.graphlib.Graph();
    //   g.setGraph({ rankdir: dir, nodesep: 16, ranksep: 16 });
    //   g.setDefaultEdgeLabel(() => ({}));

    //   const width = 260;
    //   const height = 90;
    //   nodes.forEach((node) => {
    //     g.setNode(node.id, { width, height });
    //   });

    //   edges.forEach((edge) => {
    //     const source = edge.getSource();
    //     const target = edge.getTarget();
    //     g.setEdge(source.cell, target.cell);
    //   });

    //   dagre.layout(g);

    //   g.nodes().forEach((id) => {
    //     const node = this.graph.getCellById(id);
    //     if (node) {
    //       const pos = g.node(id);
    //       node.position(pos.x, pos.y);
    //     }
    //   });

    //   edges.forEach((edge) => {
    //     const source = edge.getSourceNode();
    //     const target = edge.getTargetNode();
    //     const sourceBBox = source.getBBox();
    //     const targetBBox = target.getBBox();

    //     if ((dir === "LR" || dir === "RL") && sourceBBox.y !== targetBBox.y) {
    //       const gap =
    //         dir === "LR"
    //           ? targetBBox.x - sourceBBox.x - sourceBBox.width
    //           : -sourceBBox.x + targetBBox.x + targetBBox.width;
    //       const fix = dir === "LR" ? sourceBBox.width : 0;
    //       const x = sourceBBox.x + fix + gap / 2;
    //       edge.setVertices([
    //         { x, y: sourceBBox.center.y },
    //         { x, y: targetBBox.center.y },
    //       ]);
    //     } else if (
    //       (dir === "TB" || dir === "BT") &&
    //       sourceBBox.x !== targetBBox.x
    //     ) {
    //       const gap =
    //         dir === "TB"
    //           ? targetBBox.y - sourceBBox.y - sourceBBox.height
    //           : -sourceBBox.y + targetBBox.y + targetBBox.height;
    //       const fix = dir === "TB" ? sourceBBox.height : 0;
    //       const y = sourceBBox.y + fix + gap / 2;
    //       edge.setVertices([
    //         { x: sourceBBox.center.x, y },
    //         { x: targetBBox.center.x, y },
    //       ]);
    //     } else {
    //       edge.setVertices([]);
    //     }
    //   });
    // },
   
  
  // -------------------------------------工具栏事件-----------------------------------------------------------
   // 保存
  onSave() {
      const nodes = this.graph.getNodes();
      const edges = this.graph.getEdges();
      console.log(nodes);
      console.log(edges);
    },

    //删除所选节点或边
    onRemove() {
      if (this.graph) {
        const cells = this.graph.getSelectedCells();
        if (cells) {
          this.graph?.removeCells(cells);
        }
      }
    },
    //下载
    onDownload(options = { fileName: "dag", bgColor: "#f2f3f7" }) {
      const { fileName, bgColor } = options;
      this.graph?.toPNG(
        (dataUri) => {
          DataUri.downloadDataUri(dataUri, `${fileName}.png`);
        },
        {
          padding: {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50,
          },
          backgroundColor: bgColor,
        }
      );
    },
    //格式化
    format() {
      if (this.layoutFormValue) {
        this.layout({ ...this.layoutFormValue, ...DEFAULT_LAYOUT_CONFIG });
      } else {
        this.layout({});
      }
    },

    //格式化布局
    layout(layoutConfig) {
      if (Object.keys(layoutConfig).length === 0) {
        layoutConfig = DEFAULT_LAYOUT_CONFIG;
      }
      if (!this.graph) {
        return;
      }

      this.graph.cleanSelection();

      let layoutFunc = null;
      if (layoutConfig.type === "dagre") {
        layoutFunc = new DagreLayout({
          type: "dagre",
          rankdir: "LR",
          align: "UL",
          // Calculate the node spacing based on the edge label length
          ranksepFunc: (d) => {
            const edges = this.graph.getOutgoingEdges(d.id);
            let max = 0;
            if (edges && edges.length > 0) {
              edges.forEach((edge) => {
                const edgeView = this.graph.findViewByCell(edge); //findViewByCell:根据节点/边 ID 或实例查找对应的视图。
                const labelView = edgeView?.findAttr(
                  "width",
                  _.get(edgeView, ["labelSelectors", "0", "body"], null)
                );
                const labelWidth = labelView ? +labelView : 0;
                max = Math.max(max, labelWidth);
              });
            }
            return layoutConfig.ranksep + max;
          },
          nodesep: layoutConfig.nodesep,
          controlPoints: true,
        });
      } else if (layoutConfig.type === "grid") {
        layoutFunc = new GridLayout({
          type: "grid",
          preventOverlap: true,
          preventOverlapPadding: layoutConfig.padding,
          sortBy: "_index",
          rows: layoutConfig.rows || undefined,
          cols: layoutConfig.cols || undefined,
          nodeSize: 220,
        });
      }

      const json = this.graph.toJSON();
      const nodes = json.cells
        .filter((cell) => cell.shape === X6_NODE_NAME)
        .map((item) => {
          return {
            ...item,
            // sort by code aesc
            _index: -item.id,
          };
        });
      const edges = json.cells.filter((cell) => cell.shape === "edge");
      const newModel = layoutFunc?.layout({
        nodes: nodes,
        edges: edges,
      });
      this.graph.fromJSON(newModel);
    },

    //搜索下拉框
    getAllNodes() {
      const nodes = this.graph.getNodes();
      console.log("nodes", nodes);
      this.$emit("getDropdownNodes", nodes);
    },

    //搜索
    navigateTo() {
      const code = this.searchSelectValue;
      if (!this.graph) return;
      const cell = this.graph.getCellById(code);
      this.graph.scrollToCell(cell, { animation: { duration: 600 } });
      this.graph.cleanSelection();
      this.graph.select(cell);
    },

// ------------------------------右键菜单事件-----------------------------------------------------
    //复制节点
    copyTask() {
      const nodeData = this.nodeVariables.menuCell.getData();
      console.log("nodeData", nodeData);
      if (!this.graph) {
        return {};
      }
      let newNode = {};
      const id = nanoid();
      const node = {
        id,
        shape: X6_NODE_NAME,
        x: this.nodeVariables.pageX + 100,
        y: this.nodeVariables.pageY + 100,
        data: {
          ...nodeData.data,
          name: `${nodeData.name}_${id.slice(0, 3)}`,
        },
        attrs: {
          title: {
            text: `${nodeData.name}_${id.slice(0, 3)}`,
          },
          image: {
            "xlink:href": tl,
          },
        },
      };
      newNode = this.graph.addNode(node);
      return newNode;
    },
    //删除节点
    remove() {
      this.graph?.removeCell(this.nodeVariables.menuCell);
    },
    //编辑
    edit() {
      this.nodeinfo.visible = true;
      this.nodeinfo.flag = "edit";
      let data = this.nodeVariables.menuCell.getData();
      this.$refs.nodeDataModal.form.setFieldsValue({
        name: data.name,
      });
    },
  },
};
</script>
<style scoped>
.dag-canvas {
  width: 85%;
  height: 100%;
}
#container {
  width: 100%;
  height: 100%;
}
#minimap {
  position: absolute;
  right: 0px;
  bottom: 0px;
  border: dashed 1px #e4e4e4;
  z-index: 9;
}


</style>
