import { useEffect, useRef, useState } from 'react';
import {
  coffeeShiftScore,
  COFFEE_MACHINE_COUNT,
  createCoffeeCup,
  hasCorrectIngredients,
  MIN_READY_FILL,
  OVERFLOW_FILL,
  SHIFT_SECONDS,
  type CoffeeCupState,
  type CoffeeIngredient,
} from '../../lib/coffeeGame';

type NoticeType = 'early' | 'overflow' | 'served' | 'wrong';
export type CoffeeNotice = { machineId: number; type: NoticeType } | null;

export function useCoffeeShift(onComplete: (score: number) => void) {
  const [cups, setCups] = useState<CoffeeCupState[]>(() =>
    Array.from({ length: COFFEE_MACHINE_COUNT }, (_, index) => createCoffeeCup(index + 1)));
  const [pouringIds, setPouringIds] = useState<number[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(SHIFT_SECONDS);
  const [served, setServed] = useState(0);
  const [notice, setNotice] = useState<CoffeeNotice>(null);
  const [started, setStarted] = useState(false);
  const cupsRef = useRef(cups);
  const servedRef = useRef(0);
  const startedAt = useRef(0);
  const finished = useRef(false);
  cupsRef.current = cups;

  useEffect(() => {
    if (!started) return;
    const timer = window.setInterval(() => {
      const elapsed = (Date.now() - startedAt.current) / 1000;
      const remaining = Math.max(0, Math.ceil(SHIFT_SECONDS - elapsed));
      setSecondsLeft(remaining);
      if (remaining === 0 && !finished.current) {
        finished.current = true;
        setPouringIds([]);
        onComplete(coffeeShiftScore(servedRef.current));
      }
    }, 200);
    return () => window.clearInterval(timer);
  }, [onComplete, started]);

  useEffect(() => {
    if (!pouringIds.length) return;
    const active = new Set(pouringIds);
    const timer = window.setInterval(() => {
      setCups((current) => current.map((cup) => active.has(cup.id)
        ? { ...cup, fill: Math.min(112, cup.fill + .9) }
        : cup));
    }, 40);
    return () => window.clearInterval(timer);
  }, [pouringIds]);

  const updateCup = (id: number, change: (cup: CoffeeCupState) => CoffeeCupState) => {
    setCups((current) => current.map((cup) => cup.id === id ? change(cup) : cup));
  };

  const addIngredient = (id: number, ingredient: CoffeeIngredient) => {
    if (pouringIds.includes(id)) return;
    setNotice(null);
    updateCup(id, (cup) => ({
      ...cup,
      ingredients: { ...cup.ingredients, [ingredient]: cup.ingredients[ingredient] + 1 },
    }));
  };

  const stopAndServe = (id: number) => {
    setPouringIds((current) => current.filter((item) => item !== id));
    const cup = cupsRef.current.find((item) => item.id === id);
    if (!cup) return;
    if (cup.fill > OVERFLOW_FILL) return setNotice({ machineId: id, type: 'overflow' });
    if (cup.fill < MIN_READY_FILL) return setNotice({ machineId: id, type: 'early' });
    if (!hasCorrectIngredients(cup)) return setNotice({ machineId: id, type: 'wrong' });
    const nextServed = servedRef.current + 1;
    servedRef.current = nextServed;
    setServed(nextServed);
    setNotice({ machineId: id, type: 'served' });
    updateCup(id, () => createCoffeeCup(id));
  };

  const toggleMachine = (id: number) => {
    if (pouringIds.includes(id)) return stopAndServe(id);
    const cup = cupsRef.current.find((item) => item.id === id);
    if (!cup || cup.fill > OVERFLOW_FILL) {
      setNotice({ machineId: id, type: 'overflow' });
      return;
    }
    setNotice(null);
    setPouringIds((current) => [...current, id]);
  };

  const discard = (id: number) => {
    setPouringIds((current) => current.filter((item) => item !== id));
    setNotice(null);
    updateCup(id, () => createCoffeeCup(id));
  };

  const startShift = () => {
    if (started) return;
    startedAt.current = Date.now();
    setStarted(true);
  };

  return {
    addIngredient, cups, discard, notice, pouringIds, secondsLeft, served,
    started, startShift, toggleMachine,
  };
}
