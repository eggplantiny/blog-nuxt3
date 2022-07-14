---
title: Pinia - Vuex 를 대체할 새로운 Store!
subtitle: Pinia 는 Vuex 를 대체할 수 있을것인가?
description: 왜 Vue 에서 가장 중요하고 핵심인 상태관리 플러그인 Vuex 를 뒤로 두고 새로운 Pinia 를 추천하게 된 것일까? Pinia 의 특징은 무엇이고 무엇이 Vuex 와 다른지 잠깐 살펴보자.
category: vue
createdAt: 2021-11-26
tags:
- vue
- composition api
- pinia
- vuex
---

얼마전 `VueConf Toronto 2021` 에서 새로운 Vue, 그러니까 Vue3 와 그의 미래에 대한 여러 이야기들이 오갔다. 그중 충격적인 장면이 있었으니 Vue 의 창시자 Evan You 가 직접 등장해 추천하는 상태 관리 플러그인을 `Vuex` 가 아닌 [Pinia](https://pinia.esm.dev/) 로 공표한 것이다.

![VueConf Toronto 2021](https://images.velog.io/images/eggplantiny/post/699066c8-f4c7-4cc3-9ad3-43bc3b89c5b4/KakaoTalk_20211125_225344889.webp)

왜 Vue 에서 가장 중요하고 핵심인 상태관리 플러그인 `Vuex` 를 뒤로 두고 새로운 `Pinia` 를 추천하게 된 것일까?

`Pinia` 의 특징은 무엇이고 `Vuex` 와 어떤점이 다른지 잠깐 살펴보자.

## Into the Pinia
```js
// stores/counter.js
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++;
    }
  },
  getters: {
    doubleCount(state) {
      return state.count * 2;
    }
  }
});
```
위 코드는 `Piana` 의 Store 선언 구문이다. `Vuex`와 차이점이 뭘까? 일단 코드를 딱 보면 뭔가 `Vuex` 와 비슷한 것 같다.
하지만 조금만 자세히 살펴보면 알게될 것이다.

그것은 **`mutations` 가 없다는 것**이다 😮. `mutations` 가 없어졌기 때문에
더이상 거추장한 `mutations` 선언 필요 없이  `actions` 에서 값이 변했다는걸 입력 할 수 있게 되었다.

또한 `Composition API` 가 익숙한 Vue3 사용자들을 위해
```js
// stores/counter.js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() {
    count.value++
  }
  const doubleCount = computed(() => count.value * 2)

  return { count, increment, doubleCount }
})
```

이렇게 Store 를 선언 할 수 있도록 만들어 주었다. 이 얼마나 간편한것인가!

그럼 이걸 Vue 에서 사용할 수 있을까 ?? 🤔

```js
import { useCounterStore } from '@/stores/counter'

export default {
  setup() {
    const counter = useCounterStore()

    const onClickAdd = () => {
      // 이런식으로 Composition API 사용하는식으로 사용도 가능하고
      counter.count++
      // 내부 API 를 사용 가능하고 (with autocompletion ✨)
      counter.$patch({ count: counter.count + 1 })
      // 또는 직접 actions 를 선언해서 사용할수도 있다.
      counter.increment()
    }
    
    return {
      onClickAdd,
      doubleValue: computed(() => counter.doubleCount),
    }
  }
}
```

이런식으로 `Composition API` 에서 사용하던것처럼 쉽고 간편하게 Store 에 접근 가능하다. 이정도면 기존 `Vuex` 에서 Store 정의하고 `mutations`, `actions`, `getters` 순서대로 개발하고 `dispatch` 를 이용해 개발하던거에 비하면 공짜나 다름 없다고 느껴진다 😮

만약 `computed` 선언이 귀찮아서 구조분해할당을 하고 싶다면

```js
// App.vue
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'

export default {
  setup() {
    const counter = useCounterStore()
    const { doubleCount } = storeToRefs(counter)

    const onClickAdd = () => {
      counter.count++
    }
    
    return {
      onClickAdd,
      doubleCount
    }
  }
}
```
이렇게 하면 쉽고 간편하게 사용할 수 있게 된다!
> ### 여기서 잠깐!
>
>Vue3 의 반응형 시스템 내부에서 [구조분해할당](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) 을 사용하는 경우 반응형이 모두 사라져 버린다🥲 그렇기 때문에 Vue3 에서는 구조분해할당을 사용하기 위해 반응형 객채를 `toRefs` 로 묶어서 반응형을 유지할 수 있도록 지원한다.
> [참조](https://v3.ko.vuejs.org/guide/reactivity-fundamentals.html#%E1%84%87%E1%85%A1%E1%86%AB%E1%84%8B%E1%85%B3%E1%86%BC%E1%84%92%E1%85%A7%E1%86%BC-%E1%84%89%E1%85%A1%E1%86%BC%E1%84%90%E1%85%A2-%E1%84%80%E1%85%AE%E1%84%8C%E1%85%A9-%E1%84%87%E1%85%AE%E1%86%AB%E1%84%92%E1%85%A2%E1%84%92%E1%85%A1%E1%84%80%E1%85%B5-destructuring)

## 그래서 왜 Pinia? 🤔
위에 글로만 읽어보면 뭔가 쉽고 편해진건 알겠는데 왜 멀쩡한 `Vuex` 를 두고 굳이 `Pinia` 를 선택해야 하나? 라는 질문을 가지게 될 것이다. 그럼 `Vuex` 와 `Pinia` 를 비교한 공식문서의 단락을 잠깐 살펴보고 결정을 해보자. [링크](https://pinia.esm.dev/introduction.html#comparison-with-vuex-3-x-4-x)

- **mutations** 는 더이상 없음.
- **Typescript** 를 지원하기위해 더이상 복잡한 래핑을 하지 않아도 된다.
- 아주 빠르고 정확한 **autocompletion**
- **namespaced modules** 은 바이바이 🙋‍♂️
- **devtools** 공식 지원

나는 여기서 `mutations` 이 없어진것과 쉽고 간편한 `Typescript` 지원이 정말 맘에 들었다. `actions` 하나 추가하기 위해서 여태 얼마나 많은 `mutations` 를 작성했던가 🥲. 또한 `Typescript` 를 한번 사용해볼려고 얼마나 삽질을 했는데 막상 Vue SFC 내부에선 잘 잡히지도 않는 타입들...🤦‍♂️ 진절머리나 나던차에 `Pinia` 를 잠깐 사용해보니 정말 신세계였다 😮

하지만 `Pinia` 를 사용하기 망설인 가장 큰 이유...
**공식 플러그인이 아닌데요...?**

##  Pinia 는 사실 공식 플러그인...? 😮
하지만 [레딧](https://www.reddit.com/r/vuejs/comments/ni3wqh/pinia_an_alternative_vuejs_store/)과 [피나아 공식 문서](https://pinia.esm.dev/introduction.html#comparison-with-vuex) 를 자세히 살펴보고 그런 걱정을 조금 덜 수 있었다.

일단 2021년 3월 2일에 올라온 [Vuex 5 에 대한 RFC](https://github.com/kiaking/rfcs/blob/vuex-5/active-rfcs/0000-vuex-5.md) 문서의 코드조각을 잠깐 살펴보자.

```js
// stores/counter.js
import { createVuex, defineStore } from 'vuex'

const vuex = createVuex()

const useCounter = defineStore({
  key: 'counter',
  state: () => ({
    count: 1
  }),
  getters: {
    double() {
      return this.count * 2
    }
  },
  actions: {
    increment() {
      this.count++
    }
  }
})
```

```js
// App.vue
import { useCounter } from '@/stores/counter'

export default {
  setup() {
    const counter = useCounter()

    return {
      counter
    }
  }
}
```
이거 뭔가 익숙한 코드 아닌가...? 🤔
사라진 `mutations`, `Composition API` 처럼 사용하는 store? 이거 아까 봤던 `Pinia` 코드 아닌가?

맞다 👌

사실 `Pinia` 는 Vue의 코어팀에서 활동하는 [Eduardo](https://github.com/posva) 가
Vuex 5 의 [RFC](https://github.com/kiaking/rfcs/blob/vuex-5/active-rfcs/0000-vuex-5.md) 에 따라 **`Vuex 5` 의 구현체로 `Pinia` 를 작성한 것**이다.
공식문서에 따르면 `Vue` 의 철학을 충실하게 따르면서 `Pinia` 를 개발중이며, 추후에 **`Pinia` 와 `Vuex 5` 두 프로젝트를 하나로 합치거나 아주 쉽게 이동할 수 있도록 지원할 것**이라 한다 😍

## 마무리
사실 새로운걸 배우고 익히는건 재밌지만 그걸 실제 프로젝트에 적용하고 녹이는건 분명 큰 도전이라 생각한다. 하지만 분명한건 `Pinia` 는 이미 어느정도 친숙한 `Composition API` 라는 틀을 이용해 상태관리를 쉽고 재밌게 만들어주는 아주 좋은 도구라는건 틀림없다 생각한다 😊

지금부터라도 앞으로 다가올 `Vue` 의 미래와 조금은 친해지기 위해 작은 사이드 프로젝트 정도는 `Pinia` 를 이용해 만들어 보는게 어떨까? 😉

> 여기 **Pinia** 에 대한 작은 [예재](https://codesandbox.io/s/brave-merkle-h0ii2?file=/src/stores/counter.js)를 만들어 봤으니 한번 확인해보자.  
