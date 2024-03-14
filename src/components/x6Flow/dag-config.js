
export const X6_NODE_NAME = 'dag-node'
export const X6_EDGE_NAME = 'dag-edge'
export const X6_PORT_OUT_NAME = 'dag-port-out'

const EDGE_COLOR = '#A2B1C3'
const BG_BLUE = '#DFE9F7'
const BG_WHITE = '#FFFFFF'
const NODE_BORDER = '#CCCCCC'
const TITLE = '#333333'
const CONTENT = '#999' 
const STROKE_BLUE = '#288FFF'
const NODE_SHADOW = 'drop-shadow(3px 3px 4px rgba(0, 0, 0, 0.2))'
const EDGE_SHADOW = 'drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.2))'

export const PORT = {
  groups: {
    [X6_PORT_OUT_NAME]: {
      position: {
        name: 'absolute',
        args: {
          x: 200,
          y: 24
        }
      },
      markup: [
        {
          tagName: 'g',
          selector: 'body',
          children: [
            {
              tagName: 'circle',
              selector: 'circle-outer'
            },
            {
              tagName: 'text',
              selector: 'plus-text'
            },
            {
              tagName: 'circle',
              selector: 'circle-inner'
            }
          ]
        }
      ],
      attrs: {
        body: {
          magnet: true
        },
        'plus-text': {
          fontSize: 12,
          fill: NODE_BORDER,
          text: '+',
          textAnchor: 'middle',
          x: 0,
          y: 3
        },
        'circle-outer': {
          stroke: NODE_BORDER,
          strokeWidth: 2,
          r: 6,
          fill: BG_WHITE
        },
        'circle-inner': {
          r: 4,
          fill: 'transparent'
        }
      }
    }
  }
}

export const PORT_HOVER = {
  groups: {
    [X6_PORT_OUT_NAME]: {
      attrs: {
        'circle-outer': {
          stroke: STROKE_BLUE,
          fill: BG_BLUE,
          r: 8
        },
        'circle-inner': {
          fill: STROKE_BLUE,
          r: 6
        }
      }
    }
  }
}

export const PORT_SELECTED = {
  groups: {
    [X6_PORT_OUT_NAME]: {
      attrs: {
        'plus-text': {
          fill: STROKE_BLUE
        },
        'circle-outer': {
          stroke: STROKE_BLUE,
          fill: BG_WHITE
        }
      }
    }
  }
}

export const NODE_STATUS_MARKUP = [
  {
    tagName: 'foreignObject',
    selector: 'fo',
    children: [
      {
        tagName: 'div',
        selector: 'fo-body',
        ns: 'http://www.w3.org/1999/xhtml'
      }
    ],
    style: {
      width: 20,
      height: 20
    }
  }
]

export const NODE = {
  width: 220,
  height: 48,
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
      className: 'dag-task-body'
    },
    {
      tagName: 'image',
      selector: 'image'
    },
    {
      tagName: 'text',
      selector: 'title'
    },
    // {
    //   tagName: 'text',
    //   selector: 'content'
    // },
  ],
  attrs: {
    body: {
      refWidth: '100%',
      refHeight: '100%',
      rx: 6,
      ry: 6,
      pointerEvents: 'visiblePainted',
      fill: BG_WHITE,
      stroke: NODE_BORDER,
      strokeWidth: 2,
      strokeDasharray: 'none',
      filter: 'none'
    },
    image: {
      // 'xlink:href':
      //     'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
      width: 30,
      height: 30,
      refX: 12,
      refY: 11,
    },
    title: {
      refX: 45,
      refY: 18,
      fontFamily: 'Microsoft Yahei',
      fontSize: 15,
      fontWeight: 'bold',
      fill: TITLE,
      strokeWidth: 0
    },
    // content: {
    //   // text: '1111',
    //   refX: 45,
    //   refY: 38,
    //   fontFamily: 'Microsoft Yahei',
    //   fontSize: 15,
    //   fill: CONTENT,
    //   strokeWidth: 0
    // },
    fo: {
      refX: '46%',
      refY: -25
    }
  },
  ports: {
    ...PORT,
    items: [
      {
        id: X6_PORT_OUT_NAME,
        group: X6_PORT_OUT_NAME
      }
    ]
  },
  // tools: [
  //   {
  //     name: 'contextmenu'
  //   }
  // ]
}

export const NODE_HOVER = {
  attrs: {
    body: {
      fill: BG_BLUE,
      stroke: STROKE_BLUE,
      strokeDasharray: '5,2'
    },
    title: {
      fill: STROKE_BLUE
    }
  }
}

export const NODE_SELECTED = {
  attrs: {
    body: {
      filter: NODE_SHADOW,
      fill: BG_WHITE,
      stroke: STROKE_BLUE,
      strokeDasharray: '5,2',
      strokeWidth: '1.5'
    },
    title: {
      fill: STROKE_BLUE
    }
  }
}

export const EDGE = {
  attrs: {
    line: {
      stroke: EDGE_COLOR,
      strokeWidth: 1.5,
      targetMarker: {
        tagName: 'path',
        fill: EDGE_COLOR,
        strokeWidth: 0,
        d: 'M 7 -5 0 0 7 5 Z'
      },
      filter: 'none'
    }
  },
  connector: {
    name: 'rounded'
  },
  router: {
    name: 'er',
    args: {
      offset: 12
    }
  },
  defaultLabel: {
    markup: [
      {
        tagName: 'rect',
        selector: 'body'
      },
      {
        tagName: 'text',
        selector: 'label'
      }
    ],
    attrs: {
      label: {
        fill: EDGE_COLOR,
        fontSize: 16,
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        pointerEvents: 'none'
      },
      body: {
        ref: 'label',
        fill: BG_WHITE,
        stroke: EDGE_COLOR,
        strokeWidth: 2,
        rx: 4,
        ry: 4,
        refWidth: '140%',
        refHeight: '140%',
        refX: '-20%',
        refY: '-20%'
      }
    },
    position: {
      distance: 0.5,
      options: {
        absoluteDistance: true,
        reverseDistance: true
      }
    }
  }
}

export const EDGE_HOVER = {
  attrs: {
    line: {
      stroke: STROKE_BLUE,
      targetMarker: {
        fill: STROKE_BLUE
      }
    }
  },
  defaultLabel: {
    attrs: {
      label: {
        fill: STROKE_BLUE
      },
      body: {
        fill: BG_WHITE,
        stroke: STROKE_BLUE
      }
    }
  }
}

export const EDGE_SELECTED = {
  attrs: {
    line: {
      stroke: STROKE_BLUE,
      targetMarker: {
        fill: STROKE_BLUE
      },
      strokeWidth: 3,
      filter: EDGE_SHADOW
    }
  },
  defaultLabel: {
    attrs: {
      label: {
        fill: STROKE_BLUE
      },
      body: {
        fill: BG_WHITE,
        stroke: STROKE_BLUE
      }
    }
  }
}


export const truncateText = (text, n) => {
  const exp = /[\u4E00-\u9FA5]/
  let res = ''
  let len = text.length
  const chinese = text.match(new RegExp(exp, 'g'))
  if (chinese) {
    len += chinese.length
  }
  if (len > n) {
    let i = 0
    let acc = 0
    while (true) {
      const char = text[i]
      if (exp.test(char)) {
        acc += 2
      } else {
        acc++
      }
      if (acc > n) break
      res += char
      i++
    }
    res += '...'
  } else {
    res = text
  }
  return res
}
