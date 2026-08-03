import { useEffect, useRef, useState } from 'react';
import {
  activeCupCount,
  coffeeShiftScore,
  createCoffeeCup,
  hasCorrectIngredients,
  MIN_READY_FILL,
  OVERFLOW_FILL,
  SHIFT_SECONDS,
  type CoffeeCupState,
  type CoffeeIngredient,
} from '../../lib/coffeeGame';

export type CoffeeNotice = 'early' | 'overflow' | 'served' | 'wrong' | null;

export function useCoffeeShift(onComplete: (score: number) => void) {
  const [cups, setCups] = useState<CoffeeCupState[]>(() => [createCoffeeCup(1)]);
  const [selectedId, setSelectedId] = useState(1);
  const [isPouring, setIsPouring] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(SHIFT_SECONDS);
  const [served, setServed] = useState(0);
  const [notice, setNotice] = useState<CoffeeNotice>(null);
  const cupsRef = useRef(cups);
  const servedRef = useRef(0);
  const startedAt = useRef(Date.now());
  const finished = useRef(false);
  cupsRef.current = cups;

  useEffect(() => {
    const timer = window.setInterval(() => {
      const elapsed = (Date.now() - startedAt.current) / 1000;
      const remaining = Math.max(0, Math.ceil(SHIFT_SECONDS - elapsed));
      setSecondsLeft(remaining);
      setCups((current) => {
        const wanted = activeCupCount(elapsed);
        if (current.length >= wanted) return current;
        return [...current, ...Array.from(
          { length: wanted - current.length },
          (_, index) => createCoffeeCup(current.length + index + 1),
        )];
      });
      if (remaining === 0 && !finished.current) {
        finished.current = true;
        setIsPouring(false);
        onComplete(coffeeShiftScore(servedRef.current));
      }
    }, 200);
    return () => window.clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    if (!isPouring) return;
    const timer = window.setInterval(() => {
      setCups((current) => current.map((cup) => cup.id === selectedId
        ? { ...cup, fill: Math.min(112, cup.fill + .9) }
        : cup));
    }, 40);
    return () => window.clearInterval(timer);
  }, [isPouring, selectedId]);

  const updateSelected = (change: (cup: CoffeeCupState) => CoffeeCupState) => {
    setCups((current) => current.map((cup) => cup.id === selectedId ? change(cup) : cup));
  };

  const addIngredient = (ingredient: CoffeeIngredient) => {
    if (isPouring) return;
    setNotice(null);
    updateSelected((cup) => ({
      ...cup,
      ingredients: { ...cup.ingredients, [ingredient]: cup.ingredients[ingredient] + 1 },
    }));
  };

  const stopAndServe = () => {
    setIsPouring(false);
    const cup = cupsRef.current.find((item) => item.id === selectedId);
    if (!cup) return;
    if (cup.fill > OVERFLOW_FILL) return setNotice('overflow');
    if (cup.fill < MIN_READY_FILL) return setNotice('early');
    if (!hasCorrectIngredients(cup)) return setNotice('wrong');
    const nextServed = servedRef.current + 1;
    servedRef.current = nextServed;
    setServed(nextServed);
    setNotice('served');
    updateSelected(() => createCoffeeCup(selectedId));
  };

  const discard = () => {
    if (isPouring) return;
    setNotice(null);
    updateSelected(() => createCoffeeCup(selectedId));
  };

  return {
    addIngredient, cups, discard, isPouring, notice, secondsLeft, selectedId, served,
    selectedCup: cups.find((cup) => cup.id === selectedId) ?? cups[0],
    selectCup: (id: number) => { if (!isPouring) { setSelectedId(id); setNotice(null); } },
    startPouring: () => { setNotice(null); setIsPouring(true); },
    stopAndServe,
  };
}
