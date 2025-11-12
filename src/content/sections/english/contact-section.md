---
enable: true # Control the visibility of this section across all pages where it is used
title: "Tell Me Your Site & Main Issue"
description: "I don’t do free audits. I do $500 fixes that rank."

# image: "/images/about-us/about-one.jpg"
# imagePosition: "left" # Choose between "left" or "right"

map:
  enable: true
  position: "right" # Choose between "left" or "right"
  title: "Map of New Work City"
  url: https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=1%20Grafton%20Street,%20Dublin,%20Ireland+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed # Embed map iframe URL generated from https://www.maps.ie/create-google-map/

# contactInformation:
#   - title: "Headquarters"
#     icon: "/images/icons/svg/location-filled.svg"
#     description: "27 Division St, New York, NY 10002, USA"
#     button:
#       # Refer to the `sharedButton` schema in `src/sections.schema.ts` for all available configuration options (e.g., enable, label, url, hoverEffect, variant, icon, tag, rel, class, target, etc.)
#       enable: true
#       label: "Get Direction"
#       url: "/"
#       # hoverEffect: "" # Optional: text-flip | creative-fill | magnetic | magnetic-text-flip
#       # variant: "" # Optional: fill | outline | text | circle
#       # rel: "" # Optional
#       # target: "" # Optional
#
#   - title: "Email Address"
#     icon: "/images/icons/svg/message-filled.svg"
#     description: |
#       folex.agency@mail.com
#       folex.agency@support.com
#     button:
#       # Refer to the `sharedButton` schema in `src/sections.schema.ts` for all available configuration options (e.g., enable, label, url, hoverEffect, variant, icon, tag, rel, class, target, etc.)
#       enable: true
#       label: "Send Message"
#       url: "mailto:folex.agency@mail.com"
#       # hoverEffect: "" # Optional: text-flip | creative-fill | magnetic | magnetic-text-flip
#       # variant: "" # Optional: fill | outline | text | circle
#       # rel: "" # Optional
#       # target: "" # Optional
#
#   - title: "Phone Number"
#     icon: "/images/icons/svg/phone-filled.svg"
#     description: |
#       +1 800 123 654 987
#       +1 800 223 984 002
#     button:
#       # Refer to the `sharedButton` schema in `src/sections.schema.ts` for all available configuration options (e.g., enable, label, url, hoverEffect, variant, icon, tag, rel, class, target, etc.)
#       enable: true
#       label: "Call Anytime"
#       url: "tel:+1800123654987"
#       # hoverEffect: "" # Optional: text-flip | creative-fill | magnetic | magnetic-text-flip
#       # variant: "" # Optional: fill | outline | text | circle
#       # rel: "" # Optional
#       # target: "" # Optional

# Check config.toml file for form action related settings
# this is also used in the footer of the personal portfolio homepage
form:
  emailSubject: "New $500 Audit Lead — SEO Repair Lab" # Customized email subject
  submitButton:
    # Refer to the `sharedButton` schema in `src/sections.schema.ts` for all available configuration options (e.g., enable, label, url, hoverEffect, variant, icon, tag, rel, class, target, etc.)
    enable: true
    label: "SEND MESSAGE"
    # hoverEffect: "" # Optional: text-flip | creative-fill | magnetic | magnetic-text-flip
    # variant: "" # Optional: fill | outline | text | circle
    # rel: "" # Optional
    # target: "" # Optional

  # This note will show at the end of form
  # note: |
  #   Your data is safe with us. We respect your privacy and never share your information. <br /> Read our [Privacy Policy](/privacy-policy/).
  inputs:
    - label: ""
      placeholder: "Full Name *"
      name: "Full Name" # This is crucial. Its indicate under which name you want to receive this field data
      required: true
      halfWidth: true
      defaultValue: ""
    - label: ""
      placeholder: "Email Address *"
      name: "Email Address" # This is crucial. Its indicate under which name you want to receive this field data
      required: true
      type: "email"
      halfWidth: true
      defaultValue: ""
    - label: ""
      placeholder: "Budget *"
      name: "Budget"
      required: true
      halfWidth: true
      dropdown:
        type: "select"
        items:
          - label: "$500 — Audit Starter"
            value: "$500"
            selected: true
          - label: "$750 — CWV Sprint"
            value: "$750"
          - label: "$1,500+ — Retainer Pro"
            value: "$1,500+"
    - label: ""
      placeholder: "Issue *"
      name: "Issue"
      required: true
      halfWidth: true
      dropdown:
        type: "select"
        items:
          - label: "EEAT"
            value: "EEAT"
            selected: true
          - label: "CWV"
            value: "CWV"
          - label: "Indexation"
            value: "Indexation"
          - label: "AI Search"
            value: "AI Search"
    - label: ""
      tag: "textarea"
      defaultValue: ""
      rows: "4" # Only work if tag is textarea
      placeholder: "Site URL + Main Issue (EEAT/CWV/Index?) *"
      name: "Details" # This is crucial. Its indicate under which name you want to receive this field data
      required: true
      halfWidth: false
    # removed marketing radio inputs
    # - label: "Referral" # only valid for type="checkbox" & type === "radio"
    #   name: "User Source" # This is crucial. Its indicate under which name you want to receive this field data
    #   required: true
    #   groupLabel: "" # Radio Inputs Label
    #   group: "source" # when you add group then it will omit space between the same group radio input
    #   type: "radio"
    #   halfWidth: true
    #   defaultValue: ""
    # - label: "Other" # only valid for type="checkbox" & type === "radio"
    #   name: "User Source" # This is crucial. Its indicate under which name you want to receive this field data
    #   required: true
    #   groupLabel: "" # Radio Inputs Label
    #   group: "source" # when you add group then it will omit space between the same group radio input
    #   type: "radio"
    #   halfWidth: true
    #   defaultValue: ""
    - label: "I agree to the terms and conditions and [privacy policy](/)." # only valid for type="checkbox" & type === "radio"
      id: "privacy-policy"
      name: "Agreed Privacy" # This is crucial. Its indicate under which name you want to receive this field data
      value: "Agreed" # Value that will be submit (applicable for type="checkbox" & type === "radio")
      checked: false # only valid for type="checkbox" & type === "radio"
      required: true
      type: "checkbox"
      halfWidth: false
      defaultValue: ""
    - note: success # info | warning | success | deprecated | hint
      parentClass: "hidden text-sm message success"
      content: We have received your message! We'll get back to you as soon as possible.
    - note: deprecated # info | warning | success | deprecated | hint
      parentClass: "hidden text-sm message error"
      content: Something went wrong! please use this mail - [folex-astro-theme@gmail.com](mailto:folex-astro-theme@gmail.com) to submit a ticket!
---
