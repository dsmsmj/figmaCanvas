 ---                                                                                                                                      
  Figma 设计思想文档                                                                                                                       
                                                                                                                                           
  一、核心哲学：游戏引擎，而非 Web 应用                                                                                                    
                                                                                                                                           
  Figma 本质上是一个游戏引擎，而非传统 Web 应用。它绕过浏览器的 HTML 渲染管线，直接操作 GPU（WebGL/WebGPU）。这个选择决定了其所有架构设计。
                                                                                                                                           
  对应到你的项目：不必走 WebGL，但"游戏引擎式"的思维方式值得借鉴——即主循环驱动渲染，而非事件驱动 React 重渲染。                            
                                                                                                                                           
  ---                                                                                                                                      
  二、场景图（Scene Graph）                                                                                                                
                                                                                                                                           
  核心思想
                                                                                                                                           
  文档是一棵节点树，每个节点有：                                                                                                           
  - 变换（Transform） — 相对于父节点的位移、旋转、缩放，用 3×2 仿射矩阵表示                                                                
  - 样式（Style） — 填充、描边、字体等视觉属性，与变换分离存储                                                                             
  - 子节点列表 — 构成树形层级                                                                                                            
                                                                                                                                           
  Document                                                                                                                                 
  └── Page                                                                                                                                 
      ├── Frame (position: matrix)                                                                                                         
      │   ├── Text  (position: matrix)                                                                                                     
      │   └── Image (position: matrix)                                                                                                   
      └── Frame                                                                                                                            
          └── Group                                                                                                                        
              └── Vector
                                                                                                                                           
  关键分离原则                                                                                                                             
   
  几何（Geometry）与样式（Style）分离。                                                                                                    
                                                                                                                                         
  - 移动对象 → 只更新变换矩阵，样式不动                                                                                                    
  - 改颜色 → 只更新样式，变换不动                                                                                                        
  - 两者独立 dirty，独立更新                                                                                                               
                                                                                                                                         
  变换矩阵而非 x/y/rotation 三元组                                                                                                         
                                                                                                                                         
  Figma 用 3×2 矩阵（不是 x/y/rotation 分离字段）描述变换：                                                                                
                                                                                                                                         
  [a  c  tx]    a = cos(r)*sx,  c = -sin(r)*sy                                                                                             
  [b  d  ty]    b = sin(r)*sx,  d =  cos(r)*sy                                                                                             
                                                                                                                                           
  好处：                                                                                                                                   
  - 父子坐标系转换只需矩阵乘法                                                                                                             
  - 任意组合变换不丢精度                                                                                                                   
  - 碰撞检测、点投影统一用矩阵运算
                                                                                                                                           
  ---                                                                                                                                      
  三、数据模型：判别节点类型
                                                                                                                                           
  节点类型系统                                                                                                                           
                                                                                                                                           
  Figma 中每种节点是独立类型，而非一个大 interface 加可选字段：                                                                          
                                                                                                                                           
  type SceneNode =                                                                                                                       
    | FrameNode
    | GroupNode
    | TextNode
    | VectorNode
    | ImageNode
    | ComponentNode
    | InstanceNode                                                                                                                         
   
  interface BaseNode {                                                                                                                     
    id: string                                                                                                                           
    name: string
    transform: Matrix3x2   // 相对父节点的变换
    visible: boolean                                                                                                                       
    locked: boolean
  }                                                                                                                                        
                                                                                                                                         
  interface FrameNode extends BaseNode {
    type: 'FRAME'
    children: SceneNode[]                                                                                                                  
    width: number
    height: number                                                                                                                         
    fills: Paint[]                                                                                                                       
    clipsContent: boolean
  }                                                                                                                                        
   
  interface TextNode extends BaseNode {                                                                                                    
    type: 'TEXT'                                                                                                                         
    characters: string
    style: TextStyle
  }

  好处：TypeScript 可以做类型收窄，处理 TextNode 时不会误访问 children。                                                                   
   
  组件与实例                                                                                                                               
                                                                                                                                         
  - Component：母版，定义形状和样式
  - Instance：组件的引用，继承 Component 的属性，但可局部覆盖（override）
  - 修改 Component → 所有 Instance 自动同步，但 override 的字段保留                                                                        
   
  ---                                                                                                                                      
  四、坐标系统                                                                                                                           
              
  两套坐标系的严格分离
                                                                                                                                           
  屏幕坐标 (Screen Space)
    ↕  viewport transform (scale + offset)                                                                                                 
  画布坐标 (Canvas Space / World Space)                                                                                                    
    ↕  node local transform (matrix)                                                                                                       
  节点本地坐标 (Local Space)                                                                                                               
                                                                                                                                           
  每层转换都有对应的正向和逆向函数，绝不混用。                                                                                             
   
  视口变换（Viewport Transform）                                                                                                           
                                                                                                                                         
  screenPoint = canvasPoint × scale + offset                                                                                               
  canvasPoint = (screenPoint - offset) / scale
                                                                                                                                           
  这是全局唯一的，代表"摄像机"位置。                                                                                                       
   
  节点本地变换                                                                                                                             
                                                                                                                                         
  节点的 transform 矩阵是相对于父节点的，获取节点在世界坐标的绝对位置需要从根节点向下累乘矩阵链。                                          
                                                                                                                                         
  ---                                                                                                                                      
  五、渲染管线                                                                                                                           
              
  脏标记（Dirty Tracking）
                                                                                                                                           
  Figma 不在每次状态变化后全量重渲染，而是：                                                                                               
  1. 标记哪些节点属性变了（dirty）                                                                                                         
  2. 渲染帧开始时，只重绘 dirty 节点                                                                                                       
  3. 父节点 dirty → 子节点也需要更新（向下传播）                                                                                         
  4. 子节点 dirty → 父节点的 AABB 可能需要更新（向上传播）                                                                                 
                                                                                                                                           
  视口裁剪（Frustum Culling）                                                                                                              
                                                                                                                                           
  不在屏幕内的节点跳过渲染（测试 AABB 与视口是否相交）。大量节点时性能提升显著。                                                           
                                                                                                                                           
  空间索引（Spatial Index）                                                                                                                
                                                                                                                                         
  用 R-tree 或四叉树（Quadtree）加速命中测试（鼠标点击哪个节点）。否则每次点击要遍历所有节点。                                             
   
  渲染顺序                                                                                                                                 
                                                                                                                                         
  场景图的后序遍历（DFS，子节点后于父节点渲染），保证层级正确。同级节点按 z-order 顺序渲染。                                               
   
  ---                                                                                                                                      
  六、交互系统                                                                                                                           
              
  工具状态机（Tool State Machine）
                                                                                                                                           
  Figma 的工具系统是一个有限状态机：
                                                                                                                                           
                click frame tool                                                                                                         
  idle ───────────────────────────→ frame-tool                                                                                             
    ↑                                    │ mousedown
    │                                    ↓                                                                                                 
    │                              drawing-frame                                                                                         
    │                                    │ mouseup
    └────────────────────────────────────┘
                                   → select-tool (自动切换)
                                                                                                                                           
  每个工具（Tool）是独立对象，实现统一接口：                                                                                               
  interface Tool {                                                                                                                         
    onMouseDown(event: CanvasMouseEvent): void                                                                                             
    onMouseMove(event: CanvasMouseEvent): void                                                                                             
    onMouseUp(event: CanvasMouseEvent): void  
    onKeyDown(event: KeyboardEvent): void                                                                                                  
    getCursor(): CSSCursor                                                                                                                 
  }                       
                                                                                                                                           
  鼠标事件先由当前激活的 Tool 处理，Tool 内部维护自己的子状态（如"是否正在拖拽"）。                                                      
                                                                                                                                           
  操作对象（Command Pattern）
                                                                                                                                           
  每个用户操作是一个 Command 对象：                                                                                                      
  interface Command {
    execute(): void  
    undo(): void   
    description: string
  }                                                                                                                                        
   
  Undo/Redo 就是操作这个 Command 栈。                                                                                                      
                                                                                                                                           
  事件坐标统一转换
                                                                                                                                           
  所有鼠标事件进入 Canvas 后，立即转换为画布坐标，后续所有处理都用画布坐标，不再接触屏幕坐标。                                           

  ---
  七、选区与变换系统
                                                                                                                                           
  选区（Selection）
                                                                                                                                           
  选中多个节点时，Figma 计算它们的 AABB（轴对齐包围盒） 合集，在这个 AABB 上显示 8 个控制柄。                                              
   
  变换操作（缩放、旋转）作用于 AABB，再反推各节点的变换。                                                                                  
                                                                                                                                         
  吸附（Snapping）                                                                                                                         
                                                                                                                                         
  - 节点边缘/中心对齐时显示红线                                                                                                            
  - 需要空间索引快速查询附近节点
  - 画布坐标下计算，不在屏幕坐标下做                                                                                                       
                                                                                                                                           
  ---                                                                                                                                      
  八、插件架构（沙箱隔离）                                                                                                                 
                                                                                                                                           
  Figma 插件在 QuickJS（WASM） 沙箱中运行，通过 message passing 访问文档 API：
                                                                                                                                           
  主线程 (Document Access)          插件 iframe (Browser APIs)                                                                           
  ┌─────────────────────────┐       ┌──────────────────────────┐                                                                           
  │  Figma Scene Graph      │       │  React UI                │                                                                           
  │  Plugin sandbox (WASM)  │ ←───→ │  fetch / DOM             │                                                                           
  │  figma.currentPage...   │  msg  │  localStorage            │                                                                           
  └─────────────────────────┘       └──────────────────────────┘                                                                           
                                                                                                                                           
  隔离的原因：插件代码不可信，不能直接操作 DOM。                                                                                           
                                                                                                                                         
  ---                                                                                                                                      
  九、文件格式与持久化                                                                                                                   
                                                                                                                                           
  操作日志（Operation Log）
                                                                                                                                           
  Figma 存储的不是节点树快照，而是操作序列（Delta）：                                                                                      
  [MoveNode{id, dx, dy}, SetFill{id, fill}, AddNode{...}, ...]
                                                                                                                                           
  好处：                                                                                                                                   
  - 增量同步（只传 diff）
  - Undo/Redo 天然支持（反向操作）                                                                                                         
  - 历史记录完整                                                                                                                         
                                                                                                                                           
  二进制序列化                                                                                                                           
                                                                                                                                           
  Figma 使用 kiwi 二进制格式（比 JSON 小 3-5×），而非 JSON。JSON 在大型文件时解析慢、体积大。                                              
   
  ---                                                                                                                                      
  十、对你重构的优先级建议                                                                                                               
                                                                                                                                           
  ┌────────┬─────────────────────────────┬─────────────────────────┬──────────────┐
  │ 优先级 │         Figma 思想          │      当前项目现状       │    可行性    │                                                        
  ├────────┼─────────────────────────────┼─────────────────────────┼──────────────┤                                                      
  │ 🔴 高  │ 判别联合节点类型            │ 单 interface + 可选字段 │ 易           │
  ├────────┼─────────────────────────────┼─────────────────────────┼──────────────┤
  │ 🔴 高  │ 工具状态机（Tool 接口）     │ 事件逻辑混在 App.tsx    │ 易           │                                                        
  ├────────┼─────────────────────────────┼─────────────────────────┼──────────────┤                                                        
  │ 🔴 高  │ Command Pattern (Undo/Redo) │ 无撤销                  │ 中           │                                                        
  ├────────┼─────────────────────────────┼─────────────────────────┼──────────────┤                                                        
  │ 🟡 中  │ 场景图树形结构              │ 扁平 nodes[] 数组       │ 中           │                                                      
  ├────────┼─────────────────────────────┼─────────────────────────┼──────────────┤
  │ 🟡 中  │ 变换矩阵（Matrix3x2）       │ x/y/rotation 三元组     │ 中           │
  ├────────┼─────────────────────────────┼─────────────────────────┼──────────────┤                                                        
  │ 🟡 中  │ 脏标记 + 视口裁剪           │ 全量重渲染              │ 中           │
  ├────────┼─────────────────────────────┼─────────────────────────┼──────────────┤                                                        
  │ 🟢 低  │ 空间索引（R-tree）          │ 遍历全部节点            │ 节点多时再加 │                                                      
  ├────────┼─────────────────────────────┼─────────────────────────┼──────────────┤                                                        
  │ 🟢 低  │ 操作日志持久化              │ 无持久化                │ 节点多时再加 │                                                      
  └────────┴─────────────────────────────┴─────────────────────────┴──────────────┘                                                        
                                                                                                                                         
  ---                                                                                                                                      
  这份文档是基于 Figma 公开的工程博客和技术分析整理的，核心设计思想是公开的，但实现细节是 Figma                                          
  专有的。你的重构可以借鉴这些思想，但实现完全是独立的。   