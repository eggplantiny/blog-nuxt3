---
title: reduce 와 ... 은 같이 쓰지마!
subtitle: Spread Operator 가 감추고 있던 진실.
description: Spread Operator ({ ..obj, a }) 는 Object.assign({}, a) 의 syntax sugar 이다.
category: javascript
createdAt: 2022-01-29
tags:
- javascript
- array
- object
---

# **Reduce** 와 **...** 구문으로 깔끔한 코드 만들기 😎

`reduce()` 라는 함수. 처음엔 정말 어려웠다 🥲. 세상 모든 문제는 `map` 과 `filter` 두 함수면 모두 다 풀어낼 수 있을것 같았다. 
하지만, 그 생각은 `reduce()` 의 진가를 몰랐기 때문이다.
`reduce()` 는 배열 형태로 되어있는 정보를 하나의 정보로 합칠때 굉장히 유용하다. 

예를들어, 

```ts
const nums = [1, 2, 3, 4, 5]
const sum = nums.reduce((acc, n) => acc + n, 0) // 15
```

이렇게 **숫자배열의 합을 계산**할때나

```ts
const menuList = [
  { id: 'tpk', name: '떡볶이' },
  { id: 'zzm', name: '짜장면' },
  { id: 'kb', name: '김밥' }
]
const menuObject = menuList
  .reduce(
    (acc, item, index) => 
      ({ ...acc, [item.id]: { name: item.name, index }}),
    {}
  )
// 출력값
// {
//   "tpk": {
//     "name": "떡볶이",
//     "index": 0
//   },
//   "zzm": {
//     "name": "짜장면",
//     "index": 1
//   },
//   "kb": {
//     "name": "김밥",
//     "index": 2
//   }
// }
```

이렇게 **배열속 객체의 값을 키로 하는 하나의 새로운 객채**를 만드는 등 아주 유용하게 쓸 수 있다. 
특히, 위의 예제처럼 `reduce()` 를 `Spread Operator` (**...** 구문) 과 함깨 활용해 아주 쉽고 깔끔하게 `Object` 를 하나로 합칠 수 있다. ☺️

그런데, **과연 위 코드가 좋은 코드일까...? 🧐**

# 대체 뭐가 문젠대? ☹️

자 이제 우리는 위의 코드를 대량의 데이터에 사용해보자.

```ts
const ITEM_SIZE = 100
const items = Array(ITEM_SIZE)
  .fill(null)
  .map((_, c) => ({ id: `item-id-${c}`, name: `item-name-${c}` }))
const obj = items
  .reduce(
    (acc, item, index) => 
      ({ ...acc, [item.id]: { name: item.name, index }}), {}
  )
```

총 100건의 데이터를 생성해 위의 코드를 한번 실행해봤다. 

사실 별 일 없었다. 

```bash
process 100 items using spread operator : 0ms
```

그럼 이번엔 1,000건의 데이터로 실행 해보자. 

```bash
process 1000 items using spread operator : 70ms
```

조금 느려지긴 했지만 실행엔 별 지장이 없었다.

다음은 10,000건의 데이터를 처리 해보자.

흠... **10,000건의 데이터니까 700ms 쯤** 걸리지 않을까 🤡
```bash
process 10000 items using spread operator : 10070ms
```

짜잔! **10,000건의 데이터를 처리하는데에 10,000ms 나 소요**되었다. 😱

~~실무에서 이런 성능이 나오면 싸다구를 연타로 맞을 수 있다 ☠️☠️☠️~~

도대체 무엇이 우리의 예상을 틀리게 만든것인가...?

# `Spread Operator` 의 실체를 파해쳐보자.

여기서 우리는 `reduce()` 속을 다시 한번 살펴보자.

```ts
({ ...acc, [item.id]: { name: item.name, index }})
```

이 구문은 `reduce()` 내부에서 `Spread Operator` 를 활용해 이전에 생성된 Object 를 풀어주고 새로운 아이템을 추가하는 구문이다.

그럼 여기서 사용된 `Spread Operator` 가 무엇인지 [TC39 Proposal](https://github.com/tc39/proposal-object-rest-spread/blob/main/Spread.md) 에서 조금 자세히 알아보자.

```ts
// Shallow Clone (excluding prototype)
let aClone1 = { ...a };
// Desugars into:
let aClone2 = Object.assign({}, a);
```

우와! `Spread Operator` 는 `Object.assign()` 에 대한 **Syntex sugar** 였던 것이다.

그럼 이제 `Object.assign()` 이 뭔지 [MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)에서 한번 살펴보자.

> Object.assign() 메서드는 출처 객체들의 **모든 열거 가능한 자체 속성을 복사해 대상 객체에 붙여넣습니다**. 그 후 대상 객체를 반환합니다.
```ts
// 유사 object.assign 코드
const src = {
  "tpk": {
    "name": "떡볶이",
      "index": 0
  }
}
const t = {}
function similarObjectAssign (target, source) {
  Object
    .getOwnPropertyNames(source)
    .forEach(key => target[key] = source[key])
  return target
}
const dst = similarObjectAssign(t, src)
console.log(t, dst, t === dst)
// { # t
//   tpk: { 
//     name: "떡볶이",
//     index: 0
//   }
// }
// { #dst
//   tpk: {
//     name: "떡볶이",
//     index: 0
//   }
// }
// true # t === dst
```

이때, `Object.assign()` 은 객체를 복사할 때 해당 객체가 가지고 있는 **키값을 배열 형태로 만들고 순회를 하면서 새로운 객체에 저장**한다.

> **Object.assign** 동작에 대해 자세히 알고 싶다면 [TC39](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.assign) 를 확인해보자.
자 우린 위 글에서 강조된 부분을 상기하고 가장 아래 코드를 우리가 `reduce()` 의 입장에 서서 한번 생각해보자.

```ts
const menuList = [
  { id: 'tpk', name: '떡볶이' },
  { id: 'zzm', name: '짜장면' },
  { id: 'kb', name: '김밥' }
]
const menuObject = menuList
  .reduce(
    (acc, item, index) =>
      ({ ...acc, [item.id]: { name: item.name, index }}),
    {}
  )
```

우선 첫번째 항목인 **{ id: 'tpk', name: '떡볶이' }** 에 대해서 연산이 진행되면 이런 결과값이 나온다.

```json
{
  "tpk": {
    "name": "떡볶이",
      "index": 0
  }
}
```

그후 두번째 항목인 **{ id: 'zzm', name: '짜장면' }** 에 대해 연산이 진행되면 
`reduce()` 내부에 선언된 `Spread Operator` 가 `Object.assign()` 의 동작을 수행하게 되는데
`Object.assign()` 은 이전에 선언된 **`acc` 에서 키값을 추출 후 순회하면서 값을 저장 후 반환**하게 된다.

```json
{
  "tpk": { // 이전 이터레이션에서 복사된 값
    "name": "떡볶이",
      "index": 0
  },
  "zzm": { // 새로 추가된 항목
    "name": "짜장면",
    "index": 1
  }
}
```

결국 위 코드는 **키의 갯수 * 항목의 갯수** 번의 연산을 처리 해야하는데
풀어쓰면 **전체 아이템 갯수 * 전체 아이템 갯수** 번의 연산을 거쳐야 하니까 **O(n^2)** 의 연산이 필요한 것이다.

![출처: https://prateeksurana.me/](https://prateeksurana.me/img/comparison-computational-complexity-1200.webp)

위 그림처럼 **O(n^2)** 는 연산해야할 항목이 늘어날수록 시간이 기하급수적으로 늘어나는것을 알 수 있다.

드디어 우리의 의문이 풀렸다. ~~우리가 왜 싸다구를 맞았는지 ☠️☠️☠️~~

왜 10,000건의 데이터에 10,000ms 가 소요됬는지 말이다.

우린 이번 챕터에서 **`Spread Operator` 가 내부적으로 값을 복사하면서 연산하기 때문에 성능이 좋지 않다**는걸 알았다.

그럼 해결책은 월까? 🧐

# 그럼 해결책은 뭐야? 😖

그것은 바로 `reduce()` 내부에서 `Spread Operator` 를 사용하지 않는것이다.

```ts
const ITEM_SIZE = 100
const items = Array(ITEM_SIZE)
  .fill(null)
  .map((_, c) => ({ id: `item-id-${c}`, name: `item-name-${c}` }))
const obj = Object
  .fromEntries(
    items.map(
      (item, index) => [item.id, { name: item.name, index }])
    )
```

위의 코드는 우리가 저 위에서 봤던 코드를 `Object.fromEntries` 를 이용해 구현한 것이다.

해당 코드의 밴치마크를 `Spread Operator` 를 사용한 코드와 비교해보면

```bash
# Spread Operator (...)
process 1000 items using spread operator : 74ms
process 10000 items using spread operator : 9954ms
# Object.fromEntries
process 1000 items using Object.fromEntries : 0ms
process 10000 items using Object.fromEntries : 6ms
```

정말 말도 안되는 차이가 나는걸 볼 수 있다. 🥲

# 오늘의 결론
우리 모두는 `Spread Operator` 라는 기능을 매우 유용하게 쓰고 있다. 가령 `{ a, b, ...rest }` 같이 활용해 **나머지 매개변수**를 묶어주거나
오늘 살펴본 예제 처럼 **여러개의 오브젝트를 하나로 합쳐줄 때** 정말 유용하게 사용할 수 있다. 하지만, 새롭게 추가된 기능이 **내부적으로 어떻게 동작하는지 이해**가 없는 상태에서 마구 남용을 하다보면 내가 개발하는 **프로덕트의 성능에 악영향**을 끼칠것은 자명하다.
앞으로는 **개발의 편의성을 위해 추가된 기능이 어떻게 동작하고 성능에 어떤 영향을 끼치는지 조금 더 고려**해서 사용하는 참된 개발자가 되는게 어떨까?

> Object 에 대한 `Spread Operator` 기능은 비교적 최근에 발표된 [ECMAScript 2018 (ECMA-262)](https://www.ecma-international.org/ecma-262/9.0/#sec-object-initializer)에 포함된 기술이다.

> 이번 글은 [Why using object spread with reduce probably a bad idea](https://prateeksurana.me/blog/why-using-object-spread-with-reduce-bad-idea/)  에서 영감을 받아 적게 되었습니다. 좋은 글이니까 한번 읽어보세요!