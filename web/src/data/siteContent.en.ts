import type { SiteContent } from "../types/content";
import {
  catalogCategories,
  catalogProducts,
  footerPolicyLinks,
  footerQuickLinks,
  tutorialVideos
} from "./catalog";

export const siteContent: SiteContent = {
  meta: {
    htmlLang: "en",
    title: "MaxPlus Sporting Goods",
    description:
      "Multi-page sporting goods brand site with product catalog, category pages, tutorials, inquiry flows, and policy pages."
  },
  theme: {
    preset: "default",
    effectsEnabled: true
  },
  header: {
    navLabel: "Main navigation",
    logoLabel: "MaxPlus home",
    logoSub: "Sporting Goods",
    toggleLabel: "Menu",
    ctaLabel: "Go To Buy",
    links: [
      { href: "/", label: "Home" },
      { href: "/brand-story", label: "Brand Story" },
      { href: "/videos", label: "Videos" },
      { href: "/products", label: "Products" },
      { href: "/blog", label: "Blog" }
    ]
  },
  hero: {
    dotLabels: ["Show slide 1", "Show slide 2", "Show slide 3"],
    slides: [
      {
        variant: "one",
        backgroundImage: "/images/hero-training.svg",
        backgroundPosition: "center center",
        eyebrow: "Athletic Lifestyle / Team Sports",
        title: "Sporting Goods That Look Ready To Move.",
        text:
          "A broader homepage direction for training gear, team sports, outdoor recreation, and active family use across the U.S.",
        actions: [
          { href: "/products", label: "Explore Products", kind: "primary" },
          { href: "/brand-story", label: "Brand Story", kind: "ghost" }
        ],
        panel: {
          type: "stack",
          eyebrow: "Featured Range",
          items: [
            { label: "Game Balls", className: "hero-stack__card--ball" },
            { label: "Training Gear", className: "hero-stack__card--train" },
            { label: "Portable Nets", className: "hero-stack__card--net" }
          ]
        }
      },
      {
        variant: "two",
        backgroundImage: "/images/hero-performance.svg",
        backgroundPosition: "center center",
        eyebrow: "Training / Recovery / Performance",
        title: "Clean Layout. Strong Product Focus. Better Retail Feel.",
        text:
          "This concept is designed to feel like a modern sporting goods brand instead of a single-product landing page.",
        actions: [
          { href: "/products", label: "View Categories", kind: "primary" },
          { href: "/search", label: "Search Catalog", kind: "ghost" }
        ],
        panel: {
          type: "metrics",
          items: [
            { title: "4 Core", body: "Product families" },
            { title: "U.S. Ready", body: "English-first layout" },
            { title: "Modular", body: "Expandable site structure" }
          ]
        }
      },
      {
        variant: "three",
        backgroundImage: "/images/hero-recreation.svg",
        backgroundPosition: "center center",
        eyebrow: "Backyard / Team / Recreation",
        title: "Built For Sports Retail, Clubs, Camps, And Daily Play.",
        text:
          "The first screen now reads as a full branded showcase with category depth, product cards, and room for future expansion.",
        actions: [
          { href: "/buy", label: "Go To Buy", kind: "primary" },
          { href: "/videos", label: "Watch Tutorials", kind: "ghost" }
        ],
        panel: {
          type: "quote",
          quote: "“This feels like a real sports equipment homepage, not a template.”",
          caption: "Target reaction"
        }
      }
    ]
  },
  videos: {
    eyebrow: "Video Guides",
    title: "Tutorial Videos",
    text: "",
    moreLabel: "More Videos",
    featured: {
      eyebrow: tutorialVideos[0].tag,
      title: tutorialVideos[0].title,
      duration: tutorialVideos[0].duration,
      href: `/videos/${tutorialVideos[0].slug}`,
      videoUrl: tutorialVideos[0].videoUrl,
      coverImage: tutorialVideos[0].coverImage,
      ctaLabel: "Watch Tutorial",
      visualClass: tutorialVideos[0].visualClass
    },
    items: tutorialVideos.slice(1, 4).map((item) => ({
      tag: item.tag,
      title: item.title,
      duration: item.duration,
      href: `/videos/${item.slug}`,
      videoUrl: item.videoUrl,
      coverImage: item.coverImage,
      visualClass: item.visualClass
    }))
  },
  featured: {
    eyebrow: "Featured Products",
    title: "Featured Products",
    text: "",
    detailsLabel: "View Details",
    moreLabel: "More Products",
    items: catalogProducts.filter((item) => item.featured).slice(0, 4)
  },
  categories: {
    eyebrow: "Category Layout",
    title: "A homepage that can scale across multiple sports categories.",
    text: "",
    moreLabel: "More Categories",
    items: catalogCategories.map((item) => ({
      title: item.title,
      text: item.summary,
      href: `/categories/${item.slug}`
    }))
  },
  reviews: {
    eyebrow: "Partner Feedback",
    title: "Reviews",
    text: "",
    displayMode: "text",
    summary: {
      label: "Average sentiment from early review rounds",
      value: "4.8/5",
      detail: "",
      metrics: [
        { value: "92%", label: "felt the site looked established" },
        { value: "3/3", label: "mentioned product clarity" },
        { value: "Fast Read", label: "more credible first read" }
      ]
    },
    items: [
      {
        id: "review-1",
        quote: "The brand block feels like a real company introduction, not a placeholder.",
        rating: 5,
        author: "Anna Reed",
        meta: "Retail Buyer",
        imageUrl: ""
      },
      {
        id: "review-2",
        quote: "The review cards make the page feel closer to a launch-ready brand site.",
        rating: 5,
        author: "Marcus Hill",
        meta: "Club Program Lead",
        imageUrl: ""
      },
      {
        id: "review-3",
        quote: "Brand story and product depth now sit in the right order for quick evaluation.",
        rating: 4,
        author: "Sophie Chen",
        meta: "Ecommerce Manager",
        imageUrl: ""
      },
      {
        id: "review-4",
        quote: "The homepage now feels organized enough for a buyer presentation.",
        rating: 5,
        author: "Liam Grant",
        meta: "Wholesale Prospect",
        imageUrl: ""
      },
      {
        id: "review-5",
        quote: "The price and CTA line reads cleanly across the product cards.",
        rating: 4,
        author: "Eva Morris",
        meta: "Retail Operations",
        imageUrl: ""
      },
      {
        id: "review-6",
        quote: "The review carousel adds proof without making the page feel crowded.",
        rating: 5,
        author: "Noah Bennett",
        meta: "Brand Consultant",
        imageUrl: ""
      }
    ]
  },
  contact: {
    eyebrow: "Feedback",
    title: "Feedback",
    text: "",
    successMessage: "Thanks. We will get back to you soon.",
    formFields: [
      {
        id: "contact-field-name",
        key: "name",
        type: "text",
        label: "Name",
        placeholder: "Your name",
        enabled: true,
        required: true,
        options: []
      },
      {
        id: "contact-field-email",
        key: "email",
        type: "email",
        label: "Email",
        placeholder: "name@email.com",
        enabled: true,
        required: true,
        options: []
      },
      {
        id: "contact-field-phone",
        key: "phone",
        type: "tel",
        label: "Phone",
        placeholder: "Your phone number",
        enabled: false,
        required: false,
        options: []
      },
      {
        id: "contact-field-company",
        key: "company",
        type: "text",
        label: "Company",
        placeholder: "Your company name",
        enabled: false,
        required: false,
        options: []
      },
      {
        id: "contact-field-interest",
        key: "interest",
        type: "select",
        label: "Main Interest",
        placeholder: "Choose one",
        enabled: true,
        required: true,
        options: [
          { value: "team-sports", label: "Team sports" },
          { value: "training", label: "Training gear" },
          { value: "outdoor-play", label: "Outdoor play" },
          { value: "mixed", label: "Mixed product range" }
        ]
      },
      {
        id: "contact-field-message",
        key: "message",
        type: "textarea",
        label: "Message",
        placeholder: "Tell us what style or product direction you want to keep.",
        enabled: true,
        required: true,
        options: []
      }
    ],
    fields: {
      nameLabel: "Name",
      namePlaceholder: "Your name",
      emailLabel: "Email",
      emailPlaceholder: "name@email.com",
      phoneLabel: "Phone",
      phonePlaceholder: "Your phone number",
      companyLabel: "Company",
      companyPlaceholder: "Your company name",
      interestLabel: "Main Interest",
      chooseOne: "Choose one",
      messageLabel: "Message",
      messagePlaceholder: "Tell us what style or product direction you want to keep.",
      submitLabel: "Send Feedback"
    },
    fieldConfig: {
      name: { enabled: true, required: true },
      email: { enabled: true, required: true },
      phone: { enabled: false, required: false },
      company: { enabled: false, required: false },
      interest: { enabled: true, required: true },
      message: { enabled: true, required: true }
    },
    interestOptions: [
      { value: "team-sports", label: "Team sports" },
      { value: "training", label: "Training gear" },
      { value: "outdoor-play", label: "Outdoor play" },
      { value: "mixed", label: "Mixed product range" }
    ],
    demoStatus: "Demo mode only. The form is styled and ready for later integration."
  },
  footer: {
    text:
      "Sporting goods brand site with category depth, product detail pages, tutorial content, and wholesale inquiry paths.",
    contactTitle: "Contact",
    socialTitle: "Social",
    quickLinksTitle: "Explore",
    policyTitle: "Policies",
    contactLinks: [
      { href: "mailto:hello@maxplus-sport.com", label: "hello@maxplus-sport.com" },
      { href: "tel:+18005550199", label: "+1 (800) 555-0199" }
    ],
    socialLinks: [
      { href: "/", label: "Instagram" },
      { href: "/", label: "Facebook" },
      { href: "/", label: "YouTube" },
      { href: "/", label: "TikTok" }
    ],
    quickLinks: footerQuickLinks,
    policyLinks: footerPolicyLinks,
    meta1: "© 2026 MaxPlus Sporting Goods. All rights reserved.",
    meta2: "Built for catalog display, wholesale leads, and content growth."
  },
  subscribe: {
    enabled: true,
    stylePreset: "classic-gift",
    toggleLabel: "Subscribe For Perks",
    eyebrow: "Member Benefits",
    title: "Subscribe with your email and order number.",
    text: "Use the popup to collect after-sales updates, member offers, and restock notices.",
    benefitsTitle: "After subscribing you can receive:",
    benefits: [
      "Early access to new product drops and restock alerts.",
      "Order-based after-sales updates and tutorial reminders.",
      "Member-only coupons and selected seasonal offers."
    ],
    submitLabel: "Subscribe",
    successMessage: "Subscription received. Please check your email inbox.",
    sourceLabel: "Website Subscribe Widget",
    formFields: [
      {
        id: "subscribe-field-email",
        key: "email",
        type: "email",
        label: "Email",
        placeholder: "Email address",
        enabled: true,
        required: true,
        options: []
      },
      {
        id: "subscribe-field-order-number",
        key: "order_number",
        type: "text",
        label: "Order Number",
        placeholder: "Order number",
        enabled: true,
        required: true,
        options: []
      }
    ]
  }
};
