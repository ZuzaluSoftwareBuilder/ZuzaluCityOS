---
description: 
globs: 
alwaysApply: false
---
# ZuzaluCityOS 客户端组件代码审查清单

本清单用于审查使用 `'use client'` 指令的 React/Next.js 组件和页面，确保其符合 ZuzaluCityOS 项目规范。

## A. 通用情况审查

你是一个资深的全栈工程师，对于 ReactJS, NextJS, JavaScript, TypeScript, HTML, CSS 和 TailwindCSS 有丰富的经验。你需要审核代码并确保代码的正确性。

如果你找到任何问题，你需要说明建议以及原因。

## B. 客户端组件审查 (`'use client'` 文件)

### 1. 数据获取

*   **[关键]** 客户端数据获取是否都通过基于 TanStack Query 的 Hooks 或者 `@/hooks` 目录下的自定义 Hooks (如 `useGraphQL`, `useUserSpace`, `useUserEvent` 等) 进行？
*   组件内部是否避免了直接调用 `fetch`, `axios`, `services/*` 中的函数？
*   数据获取 Hooks 是否正确处理并返回了 `isLoading`, `error`, `data` 状态？

### 2. 状态管理

*   组件内部的局部 UI 状态是否使用了 `useState` 或 `useReducer`？
*   跨组件或全局状态 (如用户信息, 钱包连接) 是否通过 `@/context/*` 提供的 Context (并使用对应的 `useMyContext()` Hook) 进行管理？
*   表单状态管理是否推荐使用了 `react-hook-form`？

### 3. 组件结构与职责

*   页面 (`page.tsx`) 是否主要负责组合组件，并将数据和回调传递下去？避免在页面组件中包含过多具体业务逻辑。
*   可复用的复杂业务场景 UI 和逻辑是否封装在了 `@/components/biz` 目录下的组件中？
*   是否优先使用了 `@/components/base` 中的基础 UI 组件，而不是重新实现或者引入自 @heroui/react？
*   Icon 是否优先使用了 `@phosphor-icons/react` 中的而不是引入自其它地方？
*   组件是否遵循单一职责原则，保持了较小的体积和复杂度？

### 4. Hooks 使用

*   可复用的逻辑（数据处理、复杂计算、副作用、业务流程）是否已抽取到 `@/hooks` 目录下的自定义 Hook 中？
*   在组件中是否存在滥用 Hooks 的情况，检查 `useCallback` 及 `useMemo` 的使用
*   Hook 命名是否遵循 `useMyHookName` 的 camelCase 格式？
*   Hook 的输入参数和返回值是否有明确的 TypeScript 类型定义？

### 5. 权限处理

*   对于需要权限控制的页面访问或组件内操作（如按钮），是否使用了 `useCheckWalletConnectAndSpacePermission` 或其他权限相关 Hooks 进行检查？
*   是否根据权限检查结果正确地进行了条件渲染或禁用了相关操作？

### 6. 加载与错误处理

*   **[关键]** 是否处理了数据获取过程中的 `isLoading` 状态，并在加载时显示了合适的骨架屏或加载指示器？
*   **[关键]** 是否处理了数据获取或操作可能出现的 `error` 状态，并向用户提供了清晰的反馈或备用 UI？

### 7. 样式 (Tailwind CSS)

*   是否主要使用 Tailwind CSS 工具类进行样式设置？
*   是否遵循了 `tailwind-best-practices` 规则？
*   是否避免了使用内联样式 (`style={{}}`) 或自定义 CSS 类 (除非在 `tailwind.config.js` 中明确定义和扩展)？
*   `@apply` 的使用是否限制在必要的、重复的模式上？

### 8. 命名与类型安全

*   组件名是否为 `PascalCase`？
*   函数、变量、Hook 名是否为 `camelCase`？

---

## C. 高影响范围修改审查

**当审查涉及以下文件或模块的修改时，请格外注意其潜在的全局影响：**

### 1. 常量文件 (`@/constants/*`, 或其他全局常量定义处)

*   修改或删除常量是否会影响多个功能模块？
*   常量命名是否清晰且符合 `UPPER_CASE` 规范？
*   新增的常量是否真的需要在全局范围内共享？

### 2. Tailwind CSS 配置文件 (`tailwind.config.js`, `globals.css`)

*   **[关键]** 对 `theme` (颜色、间距、字体、断点等) 的修改是否与设计系统保持一致？
*   新增或修改颜色、间距等是否可能导致现有 UI 出现意外变化？
*   修改 `@layer` 或基础样式 (`globals.css`) 是否必要，并已评估其全局副作用？
*   添加新的插件或预设是否经过团队讨论？
*   配置修改（如 `content`, `purge`, `plugins`）是否正确，并理解其对构建大小和开发体验的影响？

### 3. 全局 Context (`@/context/*`)

*   修改 Context 的 Provider 或其提供的 value/API 是否会破坏依赖该 Context 的组件？ (属于 Breaking Change)
*   Context 的设计是否仍然合理？是否承担了过多的职责？
*   对 Context 的修改是否伴随着对其所有使用处的检查和必要更新？

### 4. 核心 Hooks 或工具函数 (`@/hooks/useGraphQL.ts`, `@/utils/*` 等共享底层逻辑)

*   修改共享 Hook 或工具函数的参数、返回值或内部逻辑是否会对所有调用方产生影响？
*   是否考虑了所有可能的边缘情况？
*   修改是否是向后兼容的？如果不是 (Breaking Change)，是否已通知所有相关开发者？
*   是否有相应的单元测试覆盖这些核心逻辑？

### 5. 基础组件 (`@/components/base/*`)

*   修改基础组件的 Props (类型、名称、默认值) 是否向后兼容？
*   修改基础组件的默认样式或行为是否符合预期，并且不会破坏现有使用场景？
*   对基础组件的重大修改是否应该考虑创建一个新的组件或变体，而不是直接修改现有组件？

### 6. 数据服务层 (`@/services/graphql/*`)

*   修改或删除一个 service 函数是否会影响所有调用它的 Hook 或组件？
*   对 GraphQL 查询/变更的修改是否与后端 API 保持同步？
*   错误处理逻辑是否仍然健壮？

### 7. 根布局或路由 (`app/layout.tsx`, 中间件等)

*   对根布局的修改（如添加新的 Provider, 修改 HTML 结构）是否对所有页面都生效且符合预期？
*   路由或中间件逻辑的修改是否正确处理了所有路径和场景？

**审查高影响范围的修改时，沟通至关重要。确保修改者清楚变更的意图和潜在影响，并在必要时进行更广泛的测试。**