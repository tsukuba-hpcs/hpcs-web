import { Slot, component$ } from "@builder.io/qwik";
import { css } from "~/styled-system/css";

interface ResearcherProps {
  name: string;
  url: string;
}

export default component$((props: ResearcherProps) => {
  return (
    <section class={css({ m: "2" })}>
      <h3 class={css({ fontSize: "xl" })}>{props.name}</h3>
      <Slot />
      <nav class={css({ m: "1" })}>
        <a
          class={css({ textDecoration: "underline", color: "blue.800" })}
          href={props.url}
        >
          教員個人ページはこちらから
        </a>
      </nav>
    </section>
  );
});