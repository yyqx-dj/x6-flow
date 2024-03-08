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
  </div>
</template>

<script>
import { Graph, Shape } from "@antv/x6";
import { nanoid } from "nanoid";
import { NODE, EDGE, X6_NODE_NAME, X6_EDGE_NAME } from "./dag-config";
import { updateCellStyle } from "./cell-active";
import tl from "./img/tl.png";
import antv from "./img/antv.png";
import ContextMenuTool from "./dag-context-menu";

import dagre from "dagre";
import "./index.css";
import "./x6-style.css";

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
      shape: "edge",
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
      shape: "edge",
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
  props: ["addNodeItem"],
  components: {
    ContextMenuTool: "ContextMenuTool",
  },
  data() {
    return {
      graph: null,
      hoverCell: {},
    };
  },
  mounted() {
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
    this.registerCustomCells();
    // this.graph.fromJSON(data); // 渲染元素
    this.layout();
    this.graph.zoomTo(0.7);
    this.graph.centerContent();
  },
  methods: {
    initGraph() {
      return new Graph({
        container: document.getElementById("container"),
        selecting: {
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
        panning: true,
        scroller: true,
        grid: {
          //网格背景
          size: 10,
          visible: true,
        },
        snapline: true,
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
              console.log("edges", edges);
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
            text: nodeItem.data.name,
          },
          image: {
            "xlink:href": tl,
          },
        },
      };
      newNode = graph.addNode(node);
      return newNode;
    },

    handleDrop(e) {
      console.log(e);
      e.preventDefault();
      const { x, y } = this.graph.clientToLocal(e.clientX, e.clientY);
      this.createNode(
        this.addNodeItem.data.type,
        this.graph,
        { x, y },
        this.addNodeItem
      );

      // 将拖动元素旋转到目标区域中
      // var data=e.dataTransfer.getData("Text");
      // e.target.appendChild(document.getElementById(data));
    },
    registerCustomCells() {
      Graph.unregisterNode(X6_NODE_NAME);
      Graph.unregisterEdge(X6_EDGE_NAME);
      Graph.registerNode(X6_NODE_NAME, { ...NODE });
      Graph.registerEdge(X6_EDGE_NAME, { ...EDGE });
    },

    // 自动布局
    layout() {
      const nodes = this.graph.getNodes();
      const edges = this.graph.getEdges();
      const g = new dagre.graphlib.Graph();
      g.setGraph({ rankdir: dir, nodesep: 16, ranksep: 16 });
      g.setDefaultEdgeLabel(() => ({}));

      const width = 260;
      const height = 90;
      nodes.forEach((node) => {
        g.setNode(node.id, { width, height });
      });

      edges.forEach((edge) => {
        const source = edge.getSource();
        const target = edge.getTarget();
        g.setEdge(source.cell, target.cell);
      });

      dagre.layout(g);

      g.nodes().forEach((id) => {
        const node = this.graph.getCellById(id);
        if (node) {
          const pos = g.node(id);
          node.position(pos.x, pos.y);
        }
      });

      edges.forEach((edge) => {
        const source = edge.getSourceNode();
        const target = edge.getTargetNode();
        const sourceBBox = source.getBBox();
        const targetBBox = target.getBBox();

        if ((dir === "LR" || dir === "RL") && sourceBBox.y !== targetBBox.y) {
          const gap =
            dir === "LR"
              ? targetBBox.x - sourceBBox.x - sourceBBox.width
              : -sourceBBox.x + targetBBox.x + targetBBox.width;
          const fix = dir === "LR" ? sourceBBox.width : 0;
          const x = sourceBBox.x + fix + gap / 2;
          edge.setVertices([
            { x, y: sourceBBox.center.y },
            { x, y: targetBBox.center.y },
          ]);
        } else if (
          (dir === "TB" || dir === "BT") &&
          sourceBBox.x !== targetBBox.x
        ) {
          const gap =
            dir === "TB"
              ? targetBBox.y - sourceBBox.y - sourceBBox.height
              : -sourceBBox.y + targetBBox.y + targetBBox.height;
          const fix = dir === "TB" ? sourceBBox.height : 0;
          const y = sourceBBox.y + fix + gap / 2;
          edge.setVertices([
            { x: sourceBBox.center.x, y },
            { x: targetBBox.center.x, y },
          ]);
        } else {
          edge.setVertices([]);
        }
      });
    },
    // 保存
    onSave(){
     const nodes = this.graph.getNodes()
     const edges = this.graph.getEdges()
     console.log(nodes)
     console.log(edges)
     
    },
    onRemove(){
      if (this.graph) {
        const cells = this.graph.getSelectedCells()
        if (cells) {  
          this.graph?.removeCells(cells)
        }
      }
    }
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
