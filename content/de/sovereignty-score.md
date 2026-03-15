---
title: "Sovereignty Score"
description: "Wie wir Tools für digitale Souveränität bewerten: Dimensionen, Regeln und Beispiele"
menu:
  main:
    name: "Sovereignty Score"
    weight: 3
---

## Was ist der Sovereignty Score?

Der **Sovereignty Score** ist eine Zahl von **0,0 bis 10,0** (in 0,5er-Schritten), die zusammenfasst, wie gut ein Tool digitale Souveränität unterstützt. Er wird **automatisch berechnet** aus den Daten, die wir für jedes Tool pflegen (z.B. Firmensitz, Open-Source-Status, Datenspeicherort). Niemand bearbeitet den Score manuell; er ist vollständig transparent und reproduzierbar.

Sie können ihn nutzen, um Tools auf einen Blick zu vergleichen. Die Aufschlüsselung nach Dimension (siehe unten) zeigt, wo ein Tool stark oder schwach ist.

**Score-Farben.** Auf Tool-Karten und Detailseiten wird der Score als farbiges Badge angezeigt. Die Farbe spiegelt den Score-Bereich wider: **Rot** (0,0–2,0), **Bernstein** (2,5–5,0), **Limettengrün** (5,5–8,0), **Grün** (8,5–10,0). Wenn wir wenige Daten für ein Tool haben, erscheint das Badge leicht verblasst (geringe Konfidenz); die genaue Konfidenz wird auf der Tool-Seite angezeigt.

---

## Warum wir diesen Score verwenden

Wir möchten Ihnen eine **klare, vergleichbare** Sicht auf Tools bieten. Der Score:

- Berücksichtigt mehrere Aspekte der Souveränität (Rechtsgrundlage, Datenkontrolle, Offenheit, Lock-in-Risiko und wie unabhängig Sie das Tool betreiben können).
- Ist **deterministisch**: Die gleichen Daten erzeugen immer den gleichen Score.
- Ist **dokumentiert**: Jede Regel ist öffentlich, damit Sie nachvollziehen können, wie Ihr bevorzugtes Tool bewertet wird.

Scores werden beim Build der Seite generiert. Sie sind nicht in unseren Quelldaten gespeichert; sie werden daraus abgeleitet.

---

## Die fünf Dimensionen

Jede Dimension wird mit **0 bis 2 Punkten** bewertet (in 0,5er-Schritten). Der Gesamtscore ist die **Summe** dieser fünf Werte, das Maximum beträgt also **10,0**.

| Dimension | Was sie misst |
| :-------- | :------------ |
| **Rechtliche Zuständigkeit** | Wo der Anbieter seinen Sitz hat und tätig ist (EU, EWR, Länder mit EU-Angemessenheitsbeschluss oder gemischt/Nicht-EU). |
| **Datenkontrolle** | Wo Daten gespeichert werden (EU, EWR, Nicht-EU oder unbekannt) und ob Self-Hosting möglich ist. |
| **Offenheit** | Ob die Software Open Source ist und ob sie offene Standards oder Protokolle nutzt. |
| **Lock-in** | Wie einfach es ist, das Tool zu verlassen (offene Standards und Datenportabilität reduzieren Lock-in). Mehr Punkte = weniger Lock-in. |
| **Betriebliche Autonomie** | Wie unabhängig Sie das Tool betreiben und kontrollieren können (Self-Hosting, Open Source oder zumindest ein EU-basierter Anbieter). |

---

## Wie jede Dimension bewertet wird

Die folgenden Tabellen beschreiben die genauen Regeln, die wir verwenden. Es sind dieselben Regeln, die in unserem Build-Prozess genutzt werden.

### Rechtliche Zuständigkeit

Wir prüfen, ob das Unternehmen in der EU/dem EWR registriert ist und in welchen Ländern es tätig ist.

| EU-Unternehmen? | Länder-Klassifizierung | Punkte |
| :--------------- | :--------------------- | -----: |
| Ja | Nur EU oder EWR | 2,0 |
| Ja | EFTA | 1,5 |
| Ja | Nur Angemessenheit | 1,0 |
| Ja | Gemischt | 1,0 |
| Ja | Nur Nicht-EU | 0,5 |
| Nein | Nur EU oder EWR | 1,5 |
| Nein | EFTA | 1,0 |
| Nein | Nur Angemessenheit | 0,5 |
| Nein | Gemischt | 0,5 |
| Nein | Nur Nicht-EU | 0,0 |

### Datenkontrolle

Wir kombinieren **Self-Hosting** (können Sie es selbst betreiben?) mit **Datenresidenz** (EU, EWR, Nicht-EU oder unbekannt).

| Self-Hosting? | Datenresidenz | Punkte |
| :------------ | :------------ | -----: |
| Ja | EU | 2,0 |
| Ja | EWR | 2,0 |
| Ja | Nicht-EU | 1,5 |
| Ja | Unbekannt | 1,0 |
| Nein | EU | 1,5 |
| Nein | EWR | 1,0 |
| Nein | Nicht-EU | 0,5 |
| Nein | Unbekannt | 0,0 |

### Offenheit

| Open Source? | Offene Standards? | Punkte |
| :----------- | :---------------- | -----: |
| Ja | Ja | 2,0 |
| Ja | Nein | 1,5 |
| Nein | Ja | 1,0 |
| Nein | Nein | 0,0 |

### Lock-in

Lock-in wird berechnet durch Addition von:

- **+1,0** wenn das Tool offene Standards nutzt.
- **+1,0** wenn volle Datenportabilität, **+0,5** bei teilweiser, **+0,0** bei keiner oder unbekannter.

Die Summe ist auf 2,0 begrenzt. Höherer Score = weniger Lock-in-Risiko.

### Betriebliche Autonomie

| Self-Hosting? | Open Source? | EU-Anbieter (falls keins)? | Punkte |
| :------------ | :----------- | :-------------------------- | -----: |
| Ja | Ja | — | 2,0 |
| Ja | Nein | — | 1,5 |
| Nein | Ja | — | 1,0 |
| Nein | Nein | Ja | 0,5 |
| Nein | Nein | Nein | 0,0 |

---

## Konfidenzniveau

Neben dem Score zeigen wir ein **Konfidenzniveau**: **hoch**, **mittel** oder **niedrig**.

- **Hoch**: Alle relevanten Daten sind vorhanden und kein Wert ist „unbekannt". Der Score ist gut fundiert.
- **Mittel**: Ein oder zwei Felder fehlen oder sind auf „unbekannt" gesetzt. Der Score könnte sich leicht ändern, wenn wir mehr Daten ergänzen.
- **Niedrig**: Mehrere Felder fehlen oder kritische Felder (z.B. Open Source, Self-Hosting) sind nicht verfügbar. Wir zeigen trotzdem einen Score (mit konservativen Standardwerten), betrachten ihn aber als unsicher.

Fehlende Booleans werden als „Nein" behandelt; fehlende Datenportabilität als „unbekannt". Scores basieren also nie auf Vermutungen; sie bleiben deterministisch.

---

## Was die Score-Bereiche bedeuten

| Score-Bereich | Interpretation |
| :------------ | :------------- |
| **0,0 – 2,0** | Geringe Souveränität; starke Abhängigkeit von Nicht-EU- oder intransparenten Anbietern. |
| **2,5 – 5,0** | Eingeschränkte Souveränität; einige EU- oder Kontrollaspekte, aber bemerkenswerter Lock-in oder mangelnde Offenheit. |
| **5,5 – 8,0** | Gute Souveränität; EU/EWR oder starke Offenheit und Kontrolle, mit einigen Lücken. |
| **8,5 – 10,0** | Hohe Souveränität; EU/EWR wo relevant, offen, selbst hostbar, geringes Lock-in. |

---

## FAQ

**Woher stammen die Daten?**
Aus den strukturierten Daten, die wir für jedes Tool pflegen (z.B. EU-Unternehmen ja/nein, Länder, Datenresidenz, Open Source, Self-Hosting, offene Standards, Datenportabilität). Sie können die Daten einsehen und Änderungen über unser Repository vorschlagen.

**Werden Scores jemals manuell angepasst?**
Nein. Der Score wird ausschließlich aus den dokumentierten Regeln berechnet. Wenn sich ein Score ändert, liegt es daran, dass sich die zugrunde liegenden Daten oder die (dokumentierten) Regeln geändert haben.

**Warum wird „Lock-in" so bewertet, dass höher besser ist?**
Wir bewerten „geringes Lock-in" positiv. Ein höherer Wert in dieser Dimension bedeutet also, dass es einfacher ist, das Tool zu verlassen oder Ihre Daten zu migrieren; ein niedrigerer Wert bedeutet mehr Lock-in-Risiko.

**Was passiert bei fehlenden Daten?**
Wir berechnen trotzdem einen Score mit konservativen Standardwerten (z.B. fehlende Booleans zählen als „Nein"). Das **Konfidenzniveau** (hoch/mittel/niedrig) zeigt Ihnen, wie viel wir wissen. Niedrige Konfidenz bedeutet, dass sich der Score ändern könnte, wenn wir mehr Daten ergänzen.

**Wie oft ändern sich Scores?**
Scores werden bei jedem Build der Seite neu generiert. Jede Änderung an Tool-Daten oder an der Scoring-Logik wird also im nächsten Build berücksichtigt.
