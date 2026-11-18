// Ključevi kurs.json su na engleskom. Model u aplikaciji ostaje na srpskim imenima.
const NA_ENGLESKI = {
  "ustanova": "institution",
  "ustanovaRed": "institutionLine",
  "ustanovaBok": "institutionSide",
  "naslov": "title",
  "slika": "image",
  "oznaka": "badge",
  "grb": "emblem",
  "trajanjeTema": "themeCount",
  "verzija": "version",
  "revizija": "revision",
  "statusIzvrsavanja": "executionStatus",
  "ciljnaGrupa": "targetGroup",
  "uvod": "introduction",
  "preduslovPrve": "firstPrerequisite",
  "povezujuciPrimer": "connectingExample",
  "nastavniObrazac": "teachingPattern",
  "dopunaGlosara": "glossaryAdditions",
  "napomeneZaIntegraciju": "integrationNotes",
  "teme": "topics",
  "cilj": "goal",
  "ocekivanje": "expectations",
  "osnov": "foundations",
  "napomenaOsnova": "foundationsNote",
  "naziv": "name",
  "veza": "link",
  "recenica": "sentence",
  "pitalica": "prompt",
  "analizaPitalice": "promptAnalysis",
  "pitalice": "prompts",
  "odgovor": "answer",
  "opcije": "options",
  "natpis": "label",
  "godina": "year",
  "vrsta": "kind",
  "pokret": "motion",
  "cvorovi": "nodes",
  "oznake": "labels",
  "tekst": "text",
  "jezik": "language",
  "izolovan": "isolated",
  "detaljnoGradivo": "detailedMaterial",
  "tokRada": "workflow",
  "graniceZnanja": "knowledgeBounds",
  "proveraRazumevanja": "comprehensionCheck",
  "editorPrimer": "editorExample",
  "izvrsavanje": "execution",
  "kod": "code",
  "nivo": "level",
  "objasnjenje": "explanation",
  "ocekivaniRezultat": "expectedResult",
  "ocekivani-izuzetak": "expectedException",
  "odgovorOdlozen": "deferredAnswer",
  "odgovor_odlozen": "deferredAnswerText",
  "okruzenje": "environment",
  "pitanje": "question",
  "predlogPopravke": "fixSuggestion",
  "pripremaTestOkruzenja": "testEnvironmentSetup",
  "promeniIProveri": "changeAndVerify",
  "provera-popravke": "fixCheck",
  "tacanOdgovor": "correctAnswer",
  "uticajNaAplikaciju": "applicationImpact",
  "uticaj_na_aplikaciju": "applicationImpactText",
  "vezaSaAplikacijom": "applicationRelation",
  "uloga": "role",
  "pozadina": "background",
  "oblik": "form",
  "dodatno": "extra",
  "dodatniOdgovor": "extraAnswer",
  "minuta": "minutes",
  "prica": "story",
  "kljucnaIdeja": "keyIdea",
  "proveraPitalice": "promptCheck",
  "tipPrimer": "exampleKind",
  "putanja": "path",
  "isecak": "snippet",
  "isecakNaslov": "snippetTitle",
  "isecakJezik": "snippetLanguage",
  "delic": "fragment",
  "originalJezik": "originalLanguage",
  "figura": "figure",
  "dijagram": "diagram",
  "samostalniPrimer": "standaloneExample",
  "blokovi": "blocks",
  "diskusija": "discussion",
  "ikona": "icon",
  "podnaslov": "subtitle",
  "ishod": "outcome",
  "predavanjeMinuta": "lectureMinutes",
  "diskusijaMinuta": "discussionMinutes",
  "preduslov": "prerequisite",
  "pretpostavka": "assumption",
  "rezerva": "reserve",
  "rezervaNapomena": "reserveNote",
  "izlaz": "exit",
  "pojmoviCasa": "lessonTerms",
  "dodatniPrimeri": "extraExamples",
  "samostalniZadaci": "independentTasks",
  "samostalnoUcenje": "independentLearning",
  "budzetMinuta": "budgetMinutes",
  "faze": "phases",
  "posle": "after",
  "napomena": "note",
  "napomenaKoraka": "stepNote",
  "pedagoskaNapomena": "pedagogicalNote",
  "tipoviPrimer": "exampleKinds",
  "redosledKoraka": "stepOrder",
  "diskusijaFaze": "discussionPhases",
  "izlazOblik": "exitForm",
  "editorDodatniPrimeri": "editorExtraExamples",
  "nemaReacta": "noReact",
  "ucenjeBezNastavnika": "learningWithoutInstructor",
  "proveraKoda": "codeCheck",
  "raspodelaVremena": "timeAllocation",
  "uKursu": "inCourse",
  "opis": "description",
  "analiza": "analysis"
};

const STABLO = {
  "keys": {
    "institution": "ustanova",
    "institutionLine": "ustanovaRed",
    "institutionSide": "ustanovaBok",
    "title": "naslov",
    "image": "slika",
    "badge": "oznaka",
    "emblem": "grb",
    "themeCount": "trajanjeTema",
    "version": "verzija",
    "revision": "revizija",
    "executionStatus": "statusIzvrsavanja",
    "targetGroup": "ciljnaGrupa",
    "introduction": "uvod",
    "firstPrerequisite": "preduslovPrve",
    "connectingExample": "povezujuciPrimer",
    "teachingPattern": "nastavniObrazac",
    "glossaryAdditions": "dopunaGlosara",
    "integrationNotes": "napomeneZaIntegraciju",
    "topics": "teme"
  },
  "children": {
    "introduction": {
      "keys": {
        "title": "naslov",
        "icon": "ikona",
        "image": "slika",
        "goal": "cilj",
        "expectations": "ocekivanje",
        "foundations": "osnov",
        "foundationsNote": "napomenaOsnova"
      },
      "children": {
        "foundations": {
          "keys": {},
          "children": {},
          "items": {
            "keys": {
              "name": "naziv",
              "link": "veza",
              "sentence": "recenica"
            },
            "children": {},
            "items": null
          }
        }
      },
      "items": null
    },
    "connectingExample": {
      "keys": {
        "name": "naziv",
        "description": "opis"
      },
      "children": {},
      "items": null
    },
    "teachingPattern": {
      "keys": {
        "stepNote": "napomenaKoraka",
        "pedagogicalNote": "pedagoskaNapomena",
        "exampleKinds": "tipoviPrimer",
        "stepOrder": "redosledKoraka",
        "discussionPhases": "diskusijaFaze",
        "exitForm": "izlazOblik",
        "independentLearning": "samostalnoUcenje",
        "editorExtraExamples": "editorDodatniPrimeri",
        "noReact": "nemaReacta",
        "learningWithoutInstructor": "ucenjeBezNastavnika",
        "codeCheck": "proveraKoda",
        "timeAllocation": "raspodelaVremena",
        "executionStatus": "statusIzvrsavanja"
      },
      "children": {
        "exampleKinds": {
          "keys": {},
          "children": {},
          "items": {
            "keys": {
              "id": "id",
              "name": "naziv",
              "description": "opis"
            },
            "children": {},
            "items": null
          }
        },
        "discussionPhases": {
          "keys": {
            "budgetMinutes": "budzetMinuta",
            "phases": "faze",
            "after": "posle",
            "note": "napomena"
          },
          "children": {
            "phases": {
              "keys": {},
              "children": {},
              "items": {
                "keys": {
                  "name": "naziv",
                  "minutes": "minuta",
                  "description": "opis"
                },
                "children": {},
                "items": null
              }
            },
            "after": {
              "keys": {
                "minutes": "minuta",
                "description": "opis"
              },
              "children": {},
              "items": null
            }
          },
          "items": null
        }
      },
      "items": null
    },
    "glossaryAdditions": {
      "keys": {},
      "children": {},
      "items": {
        "keys": {
          "id": "id",
          "name": "name",
          "hint": "hint",
          "body": "body",
          "inCourse": "uKursu"
        },
        "children": {},
        "items": null
      }
    },
    "topics": {
      "keys": {},
      "children": {},
      "items": {
        "keys": {
          "title": "naslov",
          "icon": "ikona",
          "image": "slika",
          "subtitle": "podnaslov",
          "outcome": "ishod",
          "minutes": "minuta",
          "lectureMinutes": "predavanjeMinuta",
          "discussionMinutes": "diskusijaMinuta",
          "prerequisite": "preduslov",
          "problem": "problem",
          "assumption": "pretpostavka",
          "options": "options",
          "reserve": "rezerva",
          "reserveNote": "rezervaNapomena",
          "exit": "izlaz",
          "lessonTerms": "pojmoviCasa",
          "extraExamples": "dodatniPrimeri",
          "independentTasks": "samostalniZadaci",
          "independentLearning": "samostalnoUcenje",
          "steps": "steps"
        },
        "children": {
          "options": {
            "keys": {},
            "children": {},
            "items": {
              "keys": {
                "key": "key",
                "text": "text",
                "ok": "ok",
                "why": "why"
              },
              "children": {},
              "items": null
            }
          },
          "reserve": {
            "keys": {
              "problem": "problem",
              "options": "options"
            },
            "children": {
              "options": {
                "keys": {},
                "children": {},
                "items": {
                  "keys": {
                    "key": "key",
                    "text": "text",
                    "ok": "ok",
                    "why": "why"
                  },
                  "children": {},
                  "items": null
                }
              }
            },
            "items": null
          },
          "lessonTerms": {
            "keys": {},
            "children": {},
            "items": {
              "keys": {
                "id": "id",
                "name": "name",
                "hint": "hint",
                "body": "body",
                "code": "code",
                "codeLanguage": "codeLanguage"
              },
              "children": {},
              "items": null
            }
          },
          "extraExamples": {
            "keys": {},
            "children": {},
            "items": {
              "keys": {
                "editorExample": "editorPrimer",
                "id": "id",
                "execution": "izvrsavanje",
                "language": "jezik",
                "code": "kod",
                "title": "naslov",
                "level": "nivo",
                "explanation": "objasnjenje",
                "expectedResult": "ocekivaniRezultat",
                "expectedException": "ocekivani-izuzetak",
                "deferredAnswer": "odgovorOdlozen",
                "deferredAnswerText": "odgovor_odlozen",
                "environment": "okruzenje",
                "options": "opcije",
                "question": "pitanje",
                "fixSuggestion": "predlogPopravke",
                "testEnvironmentSetup": "pripremaTestOkruzenja",
                "changeAndVerify": "promeniIProveri",
                "fixCheck": "provera-popravke",
                "correctAnswer": "tacanOdgovor",
                "applicationImpact": "uticajNaAplikaciju",
                "applicationImpactText": "uticaj_na_aplikaciju",
                "introduction": "uvod",
                "applicationRelation": "vezaSaAplikacijom",
                "kind": "vrsta"
              },
              "children": {
                "language": {
                  "keys": {},
                  "children": {},
                  "items": null
                },
                "options": {
                  "keys": {},
                  "children": {},
                  "items": {
                    "keys": {
                      "key": "key",
                      "text": "text",
                      "ok": "ok",
                      "why": "why"
                    },
                    "children": {},
                    "items": null
                  }
                }
              },
              "items": null
            }
          },
          "independentLearning": {
            "keys": {
              "introduction": "uvod",
              "detailedMaterial": "detaljnoGradivo",
              "workflow": "tokRada",
              "knowledgeBounds": "graniceZnanja",
              "comprehensionCheck": "proveraRazumevanja"
            },
            "children": {},
            "items": null
          },
          "steps": {
            "keys": {},
            "children": {},
            "items": {
              "keys": {
                "title": "naslov",
                "level": "nivo",
                "minutes": "minuta",
                "text": "tekst",
                "story": "prica",
                "keyIdea": "kljucnaIdeja",
                "prompt": "pitalica",
                "options": "opcije",
                "promptAnalysis": "analizaPitalice",
                "prompts": "pitalice",
                "promptCheck": "proveraPitalice",
                "exampleKind": "tipPrimer",
                "path": "putanja",
                "snippet": "isecak",
                "snippetTitle": "isecakNaslov",
                "snippetLanguage": "isecakJezik",
                "fragment": "delic",
                "original": "original",
                "originalLanguage": "originalJezik",
                "figure": "figura",
                "diagram": "dijagram",
                "standaloneExample": "samostalniPrimer",
                "blocks": "blokovi",
                "discussion": "diskusija"
              },
              "children": {
                "options": {
                  "keys": {},
                  "children": {},
                  "items": {
                    "keys": {
                      "key": "key",
                      "text": "text",
                      "ok": "ok",
                      "why": "why"
                    },
                    "children": {},
                    "items": null
                  }
                },
                "prompts": {
                  "keys": {},
                  "children": {},
                  "items": {
                    "keys": {
                      "prompt": "pitalica",
                      "answer": "odgovor",
                      "options": "opcije",
                      "promptAnalysis": "analizaPitalice"
                    },
                    "children": {
                      "options": {
                        "keys": {},
                        "children": {},
                        "items": {
                          "keys": {
                            "key": "key",
                            "text": "text",
                            "ok": "ok",
                            "why": "why"
                          },
                          "children": {},
                          "items": null
                        }
                      }
                    },
                    "items": null
                  }
                },
                "snippetLanguage": {
                  "keys": {},
                  "children": {},
                  "items": null
                },
                "originalLanguage": {
                  "keys": {},
                  "children": {},
                  "items": null
                },
                "figure": {
                  "keys": {
                    "kind": "vrsta",
                    "motion": "pokret",
                    "nodes": "cvorovi",
                    "labels": "oznake"
                  },
                  "children": {
                    "nodes": {
                      "keys": {},
                      "children": {},
                      "items": {
                        "keys": {
                          "id": "id",
                          "label": "natpis"
                        },
                        "children": {},
                        "items": null
                      }
                    },
                    "labels": {
                      "keys": {},
                      "children": {},
                      "items": {
                        "keys": {
                          "year": "godina",
                          "label": "natpis"
                        },
                        "children": {},
                        "items": null
                      }
                    }
                  },
                  "items": null
                },
                "diagram": {
                  "keys": {
                    "format": "format",
                    "text": "tekst"
                  },
                  "children": {},
                  "items": null
                },
                "standaloneExample": {
                  "keys": {
                    "language": "jezik",
                    "isolated": "izolovan",
                    "text": "tekst"
                  },
                  "children": {
                    "language": {
                      "keys": {},
                      "children": {},
                      "items": null
                    }
                  },
                  "items": null
                },
                "blocks": {
                  "keys": {},
                  "children": {},
                  "items": {
                    "keys": {
                      "id": "id",
                      "kind": "vrsta",
                      "text": "tekst",
                      "role": "uloga",
                      "title": "naslov",
                      "background": "pozadina",
                      "language": "jezik",
                      "link": "veza",
                      "form": "oblik",
                      "answer": "odgovor",
                      "analysis": "analiza",
                      "extra": "dodatno",
                      "extraAnswer": "dodatniOdgovor",
                      "options": "opcije"
                    },
                    "children": {
                      "language": {
                        "keys": {},
                        "children": {},
                        "items": null
                      },
                      "options": {
                        "keys": {},
                        "children": {},
                        "items": {
                          "keys": {
                            "key": "key",
                            "text": "text",
                            "ok": "ok",
                            "why": "why"
                          },
                          "children": {},
                          "items": null
                        }
                      }
                    },
                    "items": null
                  }
                },
                "discussion": {
                  "keys": {},
                  "children": {},
                  "items": {
                    "keys": {
                      "id": "id",
                      "kind": "vrsta",
                      "text": "tekst",
                      "role": "uloga",
                      "title": "naslov",
                      "background": "pozadina",
                      "language": "jezik",
                      "link": "veza",
                      "form": "oblik",
                      "answer": "odgovor",
                      "analysis": "analiza",
                      "extra": "dodatno",
                      "extraAnswer": "dodatniOdgovor",
                      "options": "opcije"
                    },
                    "children": {
                      "language": {
                        "keys": {},
                        "children": {},
                        "items": null
                      },
                      "options": {
                        "keys": {},
                        "children": {},
                        "items": {
                          "keys": {
                            "key": "key",
                            "text": "text",
                            "ok": "ok",
                            "why": "why"
                          },
                          "children": {},
                          "items": null
                        }
                      }
                    },
                    "items": null
                  }
                }
              },
              "items": null
            }
          }
        },
        "items": null
      }
    }
  },
  "items": null
};

export function uEngleski(vrednost) {
  if (Array.isArray(vrednost)) return vrednost.map(uEngleski);
  if (!vrednost || typeof vrednost !== "object") return vrednost;
  const izlaz = {};
  for (const [kljuc, val] of Object.entries(vrednost)) {
    izlaz[NA_ENGLESKI[kljuc] || kljuc] = uEngleski(val);
  }
  return izlaz;
}

export function izEngleskog(vrednost, cvor = STABLO) {
  if (Array.isArray(vrednost)) return vrednost.map((stavka) => izEngleskog(stavka, cvor?.items || null));
  if (!vrednost || typeof vrednost !== "object") return vrednost;
  const tabela = cvor?.keys || null;
  const deca = cvor?.children || null;
  const izlaz = {};
  for (const [kljuc, val] of Object.entries(vrednost)) {
    izlaz[tabela?.[kljuc] || kljuc] = izEngleskog(val, deca?.[kljuc] || null);
  }
  return izlaz;
}
