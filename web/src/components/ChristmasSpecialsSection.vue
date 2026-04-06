<script setup lang="ts">
const highlights = [
  {
    title: "Gift-ready presentation",
    text: "Premium holiday wrapping cues and a warmer festive first impression."
  },
  {
    title: "Curated seasonal picks",
    text: "A tighter selection built for gifting, family play, and winter campaigns."
  },
  {
    title: "Limited holiday offers",
    text: "Seasonal bundles and festive add-ons that feel distinct from the default theme."
  }
];
</script>

<template>
  <section class="section christmas-specials" aria-labelledby="christmas-specials-title">
    <div class="shell">
      <div class="christmas-specials__layout reveal" v-reveal>
        <div class="christmas-specials__copy">
          <p class="eyebrow">Holiday Campaign</p>
          <h2 id="christmas-specials-title">Christmas Specials</h2>
          <p class="christmas-specials__text">
            Discover gift-ready picks, warmer holiday visuals, and festive offers designed to make the homepage feel more celebratory without changing its core structure.
          </p>

          <ul class="christmas-specials__points">
            <li v-for="item in highlights" :key="item.title">
              <strong>{{ item.title }}</strong>
              <span>{{ item.text }}</span>
            </li>
          </ul>

          <RouterLink class="button button--primary button--xmas christmas-specials__cta" to="/products">
            Explore Holiday Deals
          </RouterLink>
        </div>

        <div class="christmas-specials__visual" aria-hidden="true">
          <div class="christmas-specials__halo"></div>
          <div class="christmas-specials__tree christmas-specials__tree--rear"></div>
          <div class="christmas-specials__tree christmas-specials__tree--front"></div>
          <div class="christmas-specials__star"></div>
          <div class="christmas-specials__gift christmas-specials__gift--left"></div>
          <div class="christmas-specials__gift christmas-specials__gift--center"></div>
          <div class="christmas-specials__gift christmas-specials__gift--right"></div>
          <div class="christmas-specials__snowline"></div>
        </div>
      </div>
    </div>
  </section>
</template>
