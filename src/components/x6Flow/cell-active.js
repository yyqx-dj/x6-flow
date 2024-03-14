import _ from 'lodash'
import {
  X6_PORT_OUT_NAME,
  PORT_HOVER,
  PORT_SELECTED,
  PORT,
  NODE,
  NODE_HOVER,
  NODE_SELECTED,
  EDGE,
  EDGE_SELECTED,
  EDGE_HOVER
} from './dag-config'



export function setEdgeStyle(graph,edge,hoverCell) {
  const isHover = edge === hoverCell.value
  const isSelected = graph.isSelected(edge)
  // TODO
  // const labelName = this.getEdgeLabelName ? this.getEdgeLabelName(edge) : ''
  let edgeProps = null

  if (isHover) {
    edgeProps = _.merge(_.cloneDeep(EDGE), EDGE_HOVER)
  } else if (isSelected) {
    edgeProps = _.merge(_.cloneDeep(EDGE), EDGE_SELECTED)
  } else {
    edgeProps = _.cloneDeep(EDGE)
  }

  edge.setAttrs(edgeProps.attrs)
  edge.setLabels([
    {
      ..._.merge(
        {
          attrs: _.cloneDeep(edgeProps.defaultLabel.attrs)
        }
        // {
        //   attrs: { label: { text: labelName } }
        // }
      )
    }
  ])
}

export function setNodeStyle(graph,node,hoverCell) {
  const isHover = node === hoverCell.value
  const isSelected = graph.isSelected(node)
  const portHover = _.cloneDeep(PORT_HOVER.groups[X6_PORT_OUT_NAME].attrs)
  const portSelected = _.cloneDeep(
    PORT_SELECTED.groups[X6_PORT_OUT_NAME].attrs
  )
  const portDefault = _.cloneDeep(PORT.groups[X6_PORT_OUT_NAME].attrs)
  const nodeHover = _.merge(_.cloneDeep(NODE.attrs), NODE_HOVER.attrs)
  const nodeSelected = _.merge(_.cloneDeep(NODE.attrs), NODE_SELECTED.attrs)

  let img = null
  let nodeAttrs = null
  let portAttrs = null

  if (isHover || isSelected) {
    img = `${window.location.origin}${window.location.pathname}images/task-icons/${(node.data
      .type !== 'FLINK_STREAM'
      ? node.data.type
      : 'FLINK'
    ).toLocaleLowerCase()}_hover.png`
    if (isHover) {
      nodeAttrs = nodeHover
      portAttrs = _.merge(portDefault, portHover)
    } else {
      nodeAttrs = nodeSelected
      portAttrs = _.merge(portDefault, portSelected)
    }
  } else {
    img = `${window.location.origin}${window.location.pathname}images/task-icons/${(node.data
      .type !== 'FLINK_STREAM'
      ? node.data.type
      : 'FLINK'
    ).toLocaleLowerCase()}.png`
    nodeAttrs = NODE.attrs
    portAttrs = portDefault
  }
  node.setAttrByPath('image/xlink:href', img)
  node.setAttrs(nodeAttrs)
  node.setPortProp(X6_PORT_OUT_NAME, 'attrs', portAttrs)
}

export function updateCellStyle(graph,cell,hoverCell) {
  if (cell.isEdge()) {
    setEdgeStyle(graph,cell,hoverCell)
  } else if (cell.isNode()) {
    setNodeStyle(graph,cell,hoverCell)
  }
}



