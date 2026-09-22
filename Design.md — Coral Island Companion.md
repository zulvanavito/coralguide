# Coral Island Companion — Design Specification

## 1. Design Overview

**Coral Island Companion** adalah mobile companion app untuk pemain Coral Island.

Aplikasi memiliki dua fungsi utama:

1. Membantu pemain **mengingat progress permainan**.
2. Membantu pemain **mengakses informasi game dengan cepat**.

Visual design menggunakan pendekatan:

> **Cozy tropical island + clean modern mobile UI**

UI harus terasa ringan, hangat, santai, dan dekat dengan atmosfer Coral Island tanpa menjadi terlalu dekoratif atau mengganggu usability.

---

# 2. Design Principles

## 2.1 Fast

Aplikasi digunakan ketika pemain sedang bermain.

Informasi dan action utama harus dapat ditemukan dalam beberapa detik.

Prioritaskan:

- Quick access
- Clear hierarchy
- Minimal interaction
- Scannable content

---

## 2.2 Simple

Jangan membuat user mengisi form yang panjang.

Task, note, dan session harus dapat dibuat dengan friction rendah.

---

## 2.3 Personal

Aplikasi bukan sekadar wiki.

Personal data pemain harus menjadi bagian utama:

- Tasks
- Notes
- Sessions
- Progress
- Game Date

---

## 2.4 Contextual

Informasi harus selalu memiliki konteks game.

Contoh:

```text
Year 1 · Summer · Day 13
```

Game Date digunakan sebagai konteks untuk:

- Task
- Note
- Session
- Calendar
- Wiki data di masa depan

---

## 2.5 Cozy, Not Cluttered

Gunakan visual tropical/cozy tetapi jangan membuat UI terlihat seperti game dashboard yang penuh elemen.

Dekorasi hanya digunakan sebagai supporting visual.

---

# 3. Visual Direction

### Design Keywords

- Cozy
- Tropical
- Relaxed
- Clean
- Friendly
- Soft
- Natural
- Lightweight
- Modern
- Mobile-first

### Avoid

- Dark enterprise UI
- Excessive gradients
- Excessive shadows
- Dense information
- Excessive animations
- Heavy glassmorphism
- Neon colors
- Excessive game HUD styling

---

# 4. Color System

Gunakan warna dasar yang terinspirasi dari tropical island, ocean, sand, dan vegetation.

## 4.1 Primary

```text
Primary
#26A6A6
```

Digunakan untuk:

- Primary button
- Active navigation
- Selected state
- Links
- Important actions

---

## 4.2 Primary Light

```text
Primary Light
#DDF4F2
```

Digunakan untuk:

- Selected cards
- Soft backgrounds
- Tags
- Secondary highlights

---

## 4.3 Background

```text
Background
#FAF9F5
```

Warm off-white.

Jangan menggunakan pure white sebagai background utama di seluruh aplikasi.

---

## 4.4 Surface

```text
Surface
#FFFFFF
```

Digunakan untuk:

- Cards
- Forms
- Lists
- Bottom sheets

---

## 4.5 Text

```text
Text Primary
#18343A

Text Secondary
#607276

Text Muted
#8A989B
```

Primary text harus memiliki contrast yang cukup terhadap background.

---

## 4.6 Accent

Gunakan accent secukupnya untuk kategori atau status.

```text
Success
#46A758

Warning
#E3A33B

Danger
#E85C5C

Info
#4C8FD9
```

Danger hanya digunakan untuk destructive action atau status penting.

---

# 5. Typography

Gunakan font sans-serif yang modern dan mudah dibaca.

Recommended:

```text
Inter
```

Fallback:

```text
System
```

Hierarchy:

```text
Display
28–32 px
Bold

Screen Title
22–24 px
Bold

Section Title
16–18 px
Semibold

Body
14–16 px
Regular

Caption
12–13 px
Regular
```

Gunakan font weight:

```text
Regular
500 Medium
600 Semibold
700 Bold
```

Hindari terlalu banyak variasi weight dalam satu screen.

---

# 6. Spacing System

Gunakan spacing berbasis kelipatan 4.

```text
4
8
12
16
20
24
32
40
48
```

Default horizontal screen padding:

```text
16 px
```

Untuk section separation:

```text
24 px
```

Untuk major section:

```text
32 px
```

---

# 7. Border Radius

Gunakan rounded UI untuk mempertahankan cozy aesthetic.

```text
Small
8 px

Medium
12 px

Card
16 px

Large / Hero
20–24 px

Pill
999 px
```

Recommended:

- Button: 12 px
- Input: 12 px
- Card: 16 px
- Hero card: 20 px
- Chip: 999 px

---

# 8. Shadows

Gunakan shadow dengan sangat ringan.

Cards tidak harus selalu memiliki shadow.

Preferred hierarchy:

```text
Default Card
Border + subtle shadow

Elevated Card
Soft shadow

Modal / Bottom Sheet
Stronger shadow
```

Jangan menggunakan heavy drop shadows.

---

# 9. Iconography

Gunakan simple rounded line icons.

Primary icon source:

```text
@expo/vector-icons
```

Recommended icon style:

- Feather
- Ionicons

Icons harus:

- Simple
- Consistent
- Recognizable
- Tidak terlalu decorative

Icon size:

```text
16 px
Small
```

```text
20 px
Default
```

```text
24 px
Navigation / Important
```

---

# 10. Navigation

Gunakan bottom tab navigation.

```text
Home
Tasks
Journal
Wiki
Profile
```

### Home

Dashboard utama.

### Tasks

Daily todo.

### Journal

Session history dan notes.

### Wiki

Game information.

### Profile

Game profile dan settings.

---

# 11. Home Dashboard

Home adalah screen paling penting.

Tujuan:

> Menjawab "Gue sekarang ada di mana dan terakhir melakukan apa?"

Structure:

```text
Greeting
↓
Game Date / Current Save
↓
Today's Tasks
↓
Last Session
↓
Quick Actions
```

---

## 11.1 Header

Contoh:

```text
Good morning,
Island Friend!
```

Gunakan greeting secara ringan.

Jangan membuat greeting terlalu besar sehingga mengambil sebagian besar screen.

---

## 11.2 Current Game Date

Hero card:

```text
My Island

Year 1 · Summer · Day 13
```

Gunakan background visual ringan atau gradient/image yang berkaitan dengan tropical island.

Current game date harus menjadi visual anchor.

---

## 11.3 Today's Tasks

Section:

```text
Today's Tasks
3/5
```

Task menggunakan checkbox.

Contoh:

```text
☐ Water crops
☐ Check the beach
☐ Talk to Ling
✓ Go diving
☐ Upgrade pickaxe
```

Completed task:

- Checkbox checked
- Text dapat menggunakan muted color
- Optional strikethrough

---

## 11.4 Last Session

Card utama untuk memory recall.

Contoh:

```text
Last Session

Summer 12 · Year 1
Farming · Fishing · Diving

"Found some new fish!
Need iron for pickaxe upgrade."

2h 14m
```

Card ini harus sangat mudah ditemukan.

---

## 11.5 Quick Actions

Primary actions:

```text
+ Add Task
+ Quick Note
End Session
```

Quick actions dapat berupa floating action atau compact buttons.

---

# 12. Add Task Screen

Screen harus sederhana.

Header:

```text
Add Task
```

Fields:

```text
Task Title
Category
Game Date
Notes (optional)
```

---

## 12.1 Task Title

Input besar dan langsung focus.

Placeholder:

```text
What do you want to do?
```

---

## 12.2 Category

Gunakan pill/chip:

```text
Farming
Fishing
Mining
Diving
Relationship
Museum
Quest
General
```

Selected category menggunakan primary color.

---

## 12.3 Game Date

Gunakan compact selectors:

```text
Year 1
Summer
Day 13
```

---

## 12.4 Notes

Optional.

Jangan menjadikan notes sebagai required field.

---

## 12.5 Save

Primary CTA:

```text
Save
```

Button harus mudah dijangkau.

---

# 13. Quick Note Screen

Quick Note harus lebih minimal dibanding Add Task.

Header:

```text
Quick Note
```

Content:

Large multiline input.

Contoh:

```text
Besok lanjut diving dari area tadi.
Butuh upgrade pickaxe.
```

Game Date ditampilkan sebagai context.

CTA:

```text
Save
```

Tujuan screen:

> Menulis sesuatu dalam kurang dari 10–15 detik.

---

# 14. Play Session Screen

Session screen digunakan ketika pemain mulai atau sedang mencatat sesi bermain.

Header:

```text
Play Session
```

---

## 14.1 Session Timer

Tampilkan timer besar:

```text
02:14:36
```

Informasi:

```text
Started at 14:26
```

Timer tidak harus terlalu visually dominant.

---

## 14.2 Game Date

```text
Year 1
Summer
Day 13
```

---

## 14.3 Activities

Gunakan selectable chips:

```text
Farming
Fishing
Mining
Diving
Relationships
Quest
Other
```

User dapat memilih lebih dari satu.

---

## 14.4 End Session

Destructive-looking red button:

```text
End Session
```

Warna merah hanya digunakan karena action tersebut mengakhiri active session.

---

# 15. End Session Screen

Setelah user menekan End Session, tampilkan summary.

Header:

```text
End Session
```

---

## 15.1 Session Summary

```text
Session Summary

02:14:36

Summer 13 · Year 1
```

---

## 15.2 Activities

```text
Farming
Fishing
Diving
```

Gunakan chips.

---

## 15.3 Notes

Textarea untuk mencatat hal penting.

Contoh:

```text
Found some new fish!
Need iron for pickaxe upgrade.
```

---

## 15.4 Next Tasks

User dapat langsung menambahkan task:

```text
☐ Continue diving
☑ Upgrade pickaxe
```

---

## 15.5 Save Session

Primary CTA:

```text
Save Session
```

Setelah berhasil:

```text
Session saved.
```

Kemudian kembali ke Home.

---

# 16. Journal / Session History

Journal bukan diary sosial.

Fungsinya adalah:

> Melihat kembali progress permainan.

List berdasarkan game date.

Contoh:

```text
Summer 12 · Year 1
Farming · Fishing · Diving
2h 14m

Summer 10 · Year 1
Farming · Mining
1h 32m

Summer 8 · Year 1
Diving · Museum
2h 05m
```

Card harus menunjukkan:

- Game date
- Activities
- Duration
- Short summary

---

# 17. Wiki Screen — P2

Wiki belum menjadi core P0, tetapi UI harus disiapkan agar dapat berkembang.

Header:

```text
Wiki
```

Search:

```text
Search for fish, crops, characters...
```

Category chips:

```text
All
Fish
Crops
Characters
Items
Recipes
```

---

# 18. Wiki Search Result

List item:

```text
[Image] Lionfish
        Fish
        Summer · Ocean

                     >
```

Information harus dapat dipindai dengan cepat.

---

# 19. Wiki Detail

Contoh:

```text
Lionfish

Fish · Summer

A beautiful but venomous fish
with striking fins.

Season
Summer

Location
Ocean

Weather
Any

Time
06:00 – 18:00

Sell Price
150g
```

Primary CTA:

```text
Add to Todo
```

CTA ini mempersiapkan integrasi P3:

> Wiki → Todo

---

# 20. Empty States

Empty state harus informative dan ringan.

Contoh Tasks:

```text
Nothing planned yet.

Add something you want
to accomplish today.

[ + Add Task ]
```

Session:

```text
No sessions yet.

Your play history will
appear here.
```

Notes:

```text
No notes yet.

Write something you want
to remember.
```

---

# 21. Loading States

Gunakan skeleton atau subtle loading indicator.

Hindari full-screen loading untuk operasi lokal yang cepat.

SQLite operations harus terasa instant.

---

# 22. Feedback

Gunakan lightweight feedback:

- Toast
- Inline status
- Button state
- Checkbox animation

Hindari modal confirmation untuk setiap action.

Contoh:

```text
Task completed
```

lebih baik daripada:

```text
Are you sure you want to complete this task?
```

---

# 23. Interaction Principles

## Tap Target

Minimum interactive target:

```text
44 × 44 px
```

---

## Primary CTA

Setiap screen sebaiknya memiliki satu primary action yang jelas.

Contoh:

```text
Add Task → Save
Quick Note → Save
End Session → Save Session
```

---

## Navigation Depth

Hindari navigation depth yang terlalu dalam.

Target:

```text
Home
 → Detail
```

atau:

```text
Home
 → Add Task
```

Tidak perlu banyak intermediate screens.

---

# 24. Responsive Considerations

Target utama:

- Android phone
- iOS phone

Design harus bekerja pada small dan large mobile screens.

Jangan mengandalkan fixed screen dimensions.

Gunakan:

- Safe Area
- Flexbox
- Responsive width
- ScrollView / FlatList
- Dynamic content height

---

# 25. Accessibility

Minimum requirements:

- Sufficient color contrast
- 44×44 minimum tap target
- Icons tidak boleh menjadi satu-satunya indicator
- Text harus readable
- Jangan menggunakan color sebagai satu-satunya status indicator

Contoh completed task:

```text
✓ + muted text
```

bukan hanya perubahan warna.

---

# 26. Animation

Animation harus subtle.

Recommended:

- Checkbox completion
- Card press
- Screen transition
- Save feedback

Avoid:

- Constant decorative animation
- Long transitions
- Heavy parallax
- Excessive bounce effects

Performance lebih penting daripada visual effects.

---

# 27. Component System

Reusable components yang direkomendasikan:

```text
Button
IconButton
Card
SectionHeader
GameDateBadge
GameDateSelector
TaskItem
TaskCard
NoteCard
SessionCard
CategoryChip
SearchBar
EmptyState
Toast
BottomTab
Avatar / Thumbnail
```

---

# 28. Component Variants

### Button

```text
Primary
Secondary
Danger
Ghost
```

### Card

```text
Default
Highlighted
Hero
Interactive
```

### Chip

```text
Default
Selected
Completed
Category
```

---

# 29. Screen Priority

Implement UI berdasarkan prioritas MVP.

## P0

```text
01. Welcome / Onboarding
02. Game Profile
03. Home
04. Add Task
05. Quick Note
06. Play Session
07. End Session
08. Journal / Last Session
```

## P1

```text
09. Task Categories
10. Basic Calendar
11. Expanded Journal
```

## P2

```text
12. Wiki Search
13. Wiki Categories
14. Wiki Detail
```

P3+ UI tidak perlu diimplementasikan sebelum fitur tersebut masuk development scope.

---

# 30. Design-to-Code Rules

Saat mengimplementasikan design:

1. Jangan hardcode spacing secara random.
2. Gunakan centralized design tokens.
3. Gunakan reusable components.
4. Jangan membuat setiap screen memiliki style system sendiri.
5. Gunakan semantic colors.
6. Jangan menggunakan inline styling berlebihan.
7. Jangan membuat component abstraction sebelum ada kebutuhan.
8. Pertahankan konsistensi radius, spacing, typography, dan button hierarchy.
9. Prioritaskan usability daripada dekorasi.
10. UI harus tetap usable ketika content menjadi lebih panjang.

---

# 31. Design Tokens

Recommended initial tokens:

```text
Colors
primary: #26A6A6
primaryLight: #DDF4F2
background: #FAF9F5
surface: #FFFFFF
textPrimary: #18343A
textSecondary: #607276
textMuted: #8A989B
success: #46A758
warning: #E3A33B
danger: #E85C5C
info: #4C8FD9
```

```text
Spacing
4
8
12
16
20
24
32
40
48
```

```text
Radius
8
12
16
20
24
999
```

```text
Typography
12
14
16
18
22
24
28
32
```

---

# 32. Design Goal

The final UI should communicate:

> **"Gue bisa kembali ke game kapan saja tanpa harus mengingat semuanya dari awal."**

The app should feel like a calm personal companion rather than a complicated productivity application or another game HUD.

The most important screen is **Home**, and the most important interaction is:

```text
Last Session
    ↓
Remember
    ↓
Today's Tasks
    ↓
Continue Playing
```

All future UI decisions should support this core experience.