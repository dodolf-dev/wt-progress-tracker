export const progressTree = {
  // USA
  "USA_Avion": { //ok 
    name: "Aviation USA",
    ranks: [
      //Rank I (ok)
      {
        name: "I",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1],
          [0, 0, 1, 1, 1, 1, 1],
        ],
        vehicles: {
          1: {id: "p-26a_34_m2"},
          2: {id: "p-36a"},
          3: {id: "bf2c_1"},
          4: {id: "os2u_group", children: [{id: "os2u_1"}, {id: "os2u_3"}]},
          5: {id: "tbd_group", children: [{id: "tbd-1_1938"}, {id: "b_18a"}]},
          6: {id: "f3f-2_galer"},
          7: {id: "p-26a_34"},
          8: {id: "p26_group", children: [{id: "p-26a_33"}, {id: "p-26b_35"}]},
          9: {id: "p-36c"},
          10: {id: "f3f-2"},
          11: {id: "sb2u_group", children: [{id: "sb2u-2"}, {id: "sb2u-3"}]},
          12: {id: "pby_group", children: [{id: "pby-5"}, {id: "pby-5a"}]},
          13: {id: "p-36c_rb"},
          14: {id: "p-36a_rasmussen"},
          15: {id: "f2a-1"},
          16: {id: "tbf_group", children: [{id: "tbf-1c"}, {id: "sbd-3"}]},
          17: {id: "pbm_1"},
          18: {id: "f2a-1_thach"},
          19: {id: "b_10b"},
        }
      },
      //rank II (ok)
      {
        name: "II",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 0]
        ],
        vehicles: {
          1: {id: "p-400"},
          2: {id: "p-36g"},
          3: {id: "f2a-3"},
          4: {id: "p-51_a-36"},
          5: {id: "b_34"},
          6: {id: "p-40e_td"},
          7: {id: "p-40c"},
          8: {id: "p-38_group", children: [{id: "p-38e"}, {id: "p-38g"}]},
          9: {id: "p-40_group", children: [{id: "p-40e"}, {id: "p-40f_10"}]},
          10: {id: "f4f_group", children: [{id: "f4f-3"}, {id: "f4f-4"}, {id: "f6f-3"}]},
          11: {id: "a-20g"},
          12: {id: "b_25j_1"},
          13: {id: "ki_43_2_late"},
          14: {id: "yp-38"},
          15: {id: "p-39_group", children: [{id: "p-39n"}, {id: "p-39q_5"}]},
          16: {id: "p-51c-10-nt"},
          17: {id: "f4u_group", children: [{id: "f4u-1a"}, {id: "f4u-1a_usmc"}, {id: "f4u-1d"}]},
          18: {id: "sb2c_group", children: [{id: "sb2c_1c"}, {id: "sb2c_4"}]},
          19: {id: "b_25j_20"},
          20: {id: "p-51a_tl"},
          21: {id: "p-43a-1"},
          22: {id: "p-38g_metal"},
          23: {id: "pbm_3"},
          24: {id: "ki_61_1a_otsu_usa"},
        }
      },
      // Rank III (ok)
      {
        name: "III",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 0, 1, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 0]
        ],
        vehicles: {
          1: {id: "p-63a-5"},
          2: {id: "p-51_early_group", children: [{id: "p-51_mk1a_usaaf"}, {id: "p-51d-5"}]},
          3: {id: "f4u-4"},
          4: {id: "pbj_group", children: [{id: "pbj_1j"}, {id: "pbj_1h"}]},
          5: {id: "b_26b_c"},
          6: {id: "a6m2_zero_usa"},
          7: {id: "xf5f"},
          8: {id: "p-63_group", children: [{id: "p-63a-10"}, {id: "p-63c-5"}]},
          9: {id: "p-47_ealy_group", children: [{id: "p-47d_22_re"}, {id: "p-47d"}]},
          10: {id: "f8f1"},
          11: {id: "p-61c_1"},
          12: {id: "b-17_group", children: [{id: "b-17e"}, {id: "b-17e_late"}]},
          13: {id: "btd-1"},
          14: {id: "pbm_5a"},
          15: {id: "p-38_late_group", children: [{id: "p-38j"}, {id: "p-38l"}]},
          16: {id: "p-47_group", children: [{id: "p-47d-28"}, {id: "p-47n-15"}]},
          17: {id: "f6f-5n"},
          18: {id: "pb4y-2"},
          19: {id: "xp-55"},
          20: {id: "p-61a_1"},
          21: {id: "xp-50"},
          22: {id: "pv_2d"},
          23: {id: "bf-109f-4_usa"},
          24: {id: "p-63c-5_kingcobra_animal_version"},
          25: {id: "fr_1_fireball"},
        }
      },
      // Rank IV (ok)
      {
        name: "IV",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 1, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 0, 1],
          [0, 0, 0, 0, 0, 0, 1],
        ],
        vehicles: {
          1: {id: "f-82e"},
          2: {id: "p-51d-30_usaaf_korea"},
          3: {id: "f4u_late_group", children: [{id: "f4u-1c"}, {id: "f4u-4b"}]},
          4: {id: "a-26_group", children: [{id: "a-26b_10"}, {id: "a-26b"}]},
          5: {id: "b-17_late_group", children: [{id: "b-17g"}, {id: "b_24d"}]},
          6: {id: "xa_38"},
          7: {id: "p-38j_marge"},
          8: {id: "p-51h-5_na"},
          9: {id: "f8f1_group", children: [{id: "f8f1b"}, {id: "f7f1"}]},
          10: {id: "douglas_ad_group", children: [{id: "douglas_ad_2"}, {id: "douglas_ad_4"}, {id: "am_1_mauler"}]},
          11: {id: "b-29"},
          12: {id: "p-51d-20-na"},
          13: {id: "p-38k"},
          14: {id: "p-51d-10"},
          15: {id: "a-26c"},
          16: {id: "p-47m-1-re"},
          17: {id: "a-26c-45-dt"},
          18: {id: "p-47m-1-re_boxted"},
          19: {id: "xf5u_1"},
          20: {id: "fw-190a-8_usa"},
          21: {id: "p-59a"},
          22: {id: "spitfire_ix_usa"},
          23: {id: "f4u-4b_vmf_214"},
          24: {id: "douglas_a_1h"},
          25: {id: "f4u-6_au-1"},
          26: {id: "f2g-1"},
          27: {id: "f7f3"},
        }
      },
      // Rank V (ok)
      {
        name: "V",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 0, 1, 1],
        ],
        vehicles: {
          1: {id: "f-80a"},
          2: {id: "f-84_group", children: [{id: "f-84b"}, {id: "f-84g"}]},
          3: {id: "f2h-2"},
          4: {id: "f3d_1"},
          5: {id: "b_57_group", children: [  {id: "b-57"},    {id: "b-57b"},  ]},
          6: {id: "f-89b"},
          7: {id: "a2d"},
          8: {id: "f-80"},
          9: {id: "f-86_group", children: [{id: "f-86a-5"}, {id: "f-86f-25"}]},
          10: {id: "f9f_group", children: [{id: "f9f-2"}, {id: "f9f-5"}, {id: "f9f-8"}]},
          11: {id: "f-84f"},
          12: {id: "f-89d"},
          13: {id: "f-86f-35"},
        }
      },
      //Rank VI (ok)
      {
        name: "VI",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 0, 1],
        ],
        vehicles: {
          1: {id: "f-104_group", children: [{id: "f-104a"}, {id: "f-104c"}]},
          2: {id: "f-86f-2"},
          3: {id: "f3h-2"},
          4: {id: "a_4b_group", children: [{id: "a_4b"}, {id: "fj_4b"}]},
          5: {id: "b_66b"},
          6: {id: "a_4e_early"},
          7: {id: "fj_4b_agm_12b"},
          8: {id: "f-100d"},
          9: {id: "f8u-2"},
          10: {id: "av_8c"},
          11: {id: "f_117"},
          12: {id: "b_52h"},
          13: {id: "av_8a"},
          14: {id: "f11f_1_late"},
          15: {id: "a_10a_early"},
          16: {id: "f4d_1"},
          17: {id: "f_106a_1972"},
        }
      },
      //Rank VII (ok)
      {
        name: "VII",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 1, 1, 1],
          [0, 0, 0, 1, 1, 1, 1],
        ],
        vehicles: {
          1: {id: "f-5e"},
          2: {id: "f-4c"},
          3: {id: "f-8e"},
          4: {id: "a_10a_late"},
          5: {id: "f-105d"},
          6: {id: "f-5c"},
          7: {id: "f-5a"},
          8: {id: "f-4e"},
          9: {id: "f-4j"},
          10: {id: "a_7_group", children: [{id: "a_7d"}, {id: "a_7e"}]},
          11: {id: "f_111a"},
          12: {id: "av_8b_na"},
          13: {id: "a_6e_tram"},
          14: {id: "a_10c"},
          15: {id: "f_111f"},
          16: {id: "f-4s"},
          17: {id: "a_7k"},
        }
      },
      //Rank VIII (ok)
      {
        name: "VIII",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 0, 0, 1, 0],
        ],
        vehicles: {
          1: {id: "f_16_group", children: [{id: "f_16a_block_10"}, {id: "f_16a_block_15_adf"}]},
          2: {id: "f_15a"},
          3: {id: "f_18_group", children: [{id: "fa_18a"}, {id: "fa_18c_late"}]},
          4: {id: "av_8b_plus"},
          5: {id: "f_15e"},
          6: {id: "f_20a"},
          7: {id: "f_14a_iriaf"},
          8: {id: "f_16c_block_50"},
          9: {id: "f_15c_msip2"},
          10: {id: "f_14_group", children: [{id: "f_14a_early"}, {id: "f_14b"}]},
          11: {id: "fa_18c_early"},
        }
      },
      //Rank IX (ok)
      {
        name: "IX",
        grid: [
          [1, 1, 1, 0, 0, 0, 0],
        ],
        vehicles: {
          1: {id: "f_16c_block_52_aesa"},
          2: {id: "f_15c_golden_eagle"},
          3: {id: "fa_18e_block_2"},
        }
      },
    ]
  },

  "USA_Helico": { //ok
    name: "Helicoptère USA",
    ranks: [
      {
        name: "V",
        grid: [
          [0,1,0,1,0],
          [0,1,1,1,0],
        ],
        vehicles: {
          1: {id: "ah_1g"},
          2: {id: "h_34"},
          3: {id: "uh_1b"},
          4: {id: "uh_1c"},
          5: {id: "uh_1c_xm_30"},
        }
      },
     {
        name: "VI",
        grid: [
          [1,0,1,1,1],
          [1,1,1,1,1],
          [0,0,0,1,0],
        ],
        vehicles: {
          1: {id: "ah_6m"},
          2: {id: "ah_1f"},
          3: {id: "rah_66"},
          4: {id: "ah_56a"},
          5: {id: "oh_58d"},
          6: {id: "ah_64a"},
          7: {id: "ah_1w"},
          8: {id: "ah_64a_greece_usa"},
          9: {id: "yah_64"},
          10: {id: "ah_64a_peten"},
        }
      },
    {
        name: "VII",
        grid: [
          [1,1,1,0,0],
          [0,1,0,0,0],
        ],
        vehicles: {
          1: {id: "mh_60l_dap"},
          2: {id: "ah_64d"},
          3: {id: "ah_1z"},
          4: {id: "ah_64e"},
        }
      },
    ]
  },

  "USA_Bateau": { //ok
    name: "Bateau haute mer USA",
    ranks: [
      // Rank I (ok)
      {
        name: "I",
        grid: [
          [1,1,0,1,0],
          [1,0,0,0,0],
        ],
        vehicles: {
          1: {id: "us_destroyer_clemson_litchfield"},
          2: {id: "us_destroyer_clemson_barker"},
          3: {id: "us_destroyer_clemson_welborn_c_wood"},
          4: {id: "us_destroyer_farragut_1942"},
        }
      },
      //Rank II (ok)
      {
        name: "II",
        grid: [
          [1,1,0,1,0],
          [0,1,0,1,0],
        ],
        vehicles: {
          1: {id: "us_destroyer_fletcher"},
          2: {id: "us_destroyer_bagley_class_bagley"},
          3: {id: "us_destroyer_bagley_class_helm"},
          4: {id: "us_destroyer_mitscher"},
          5: {id: "us_destroyer_mitscher_wilkinson"},
        }
      },
      //Rank III (ok)
      {
        name: "III",
        grid: [
          [1,1,1,1,1],
          [1,1,1,1,1],
          [0,0,0,1,1],
          [0,0,0,1,0],
        ],
        vehicles: {
          1: {id: "us_destroyer_porter_1941"},
          2: {id: "us_cruiser_omaha_class_trenton"},
          3: {id: "us_destroyer_sumner"},
          4: {id: "us_destroyer_gearing_frank_knox"},
          5: {id: "us_destroyer_somers_davis"},
          6: {id: "us_destroyer_somers"},
          7: {id: "us_cruiser_omaha_class_raleigh"},
          8: {id: "us_destroyer_gearing"},
          9: {id: "us_destroyer_fletcher_cowell"},
          10: {id: "us_destroyer_porter_1944"},
          11: {id: "us_destroyer_porter_1942"},
          12: {id: "us_cruiser_omaha_class_detroit"},
          13: {id: "us_destroyer_fletcher_bennion"},
        }
      },
      //Rank IV (ok)
      {
        name: "IV",
        grid: [
          [1,1,1,1,0],
          [1,1,1,0,0],
          [1,0,0,0,0]
        ],
        vehicles: {
          1: {id: "us_destroyer_cf_adams_class_cf_adams"},
          2: {id: "us_cruiser_cleveland_class_cleveland"},
          3: {id: "us_cruiser_northampton_pensacola_group", children: [{id: "us_cruiser_northampton_class"}, {id: "us_cruiser_portland_class"}, {id: "us_cruiser_pensacola_class"}]},
          4: {id: "us_cruiser_brooklyn_class_helena"},
          5: {id: "us_destroyer_forrestsherman_class"},
          6: {id: "us_cruiser_fargo_brooklyn_group", children: [{id: "us_cruiser_fargo_class"}, {id: "us_cruiser_brooklyn_class_brooklyn"}]},
          7: {id: "us_cruiser_new_orleans_class"},
          8: {id: "us_cruiser_atlanta_class_atlanta"},
        }
      },
      //Rank V (ok)
      {
        name: "V",
        grid: [
          [1,1,1,1,1],
          [1,1,1,1,1],
        ],
        vehicles: {
          1: {id: "us_cruiser_worcester_class_roanoke"},
          2: {id: "us_battleship_north_dakota"},
          3: {id: "us_cruiser_baltimore_class_pittsburgh"},
          4: {id: "us_cruiser_baltimore_class"},
          5: {id: "us_cruiser_des_moines_class_newport_news"},
          6: {id: "us_battleship_texas"},
          7: {id: "us_battleship_wyoming_class"},
          8: {id: "us_cruiser_oregon_class"},
          9: {id: "us_battleship_arkansas"},
          10: {id: "us_cruiser_des_moines_class"},
        }
      },
      {
        name: "VI",
        grid: [
          [1,1,1,1,1],
          [1,1,0,1,0],
        ],
        vehicles: {
          1: {id: "us_battleship_arizona_1931"},
          2: {id: "us_battleship_nevada"},
          3: {id: "us_battlecruiser_alaska_class"},
          4: {id: "us_battleship_mississippi"},
          5: {id: "us_battleship_oklahoma"},
          6: {id: "us_battleship_colorado_class_colorado"},
          7: {id: "us_battleship_tennessee"},
          8: {id: "us_battleship_colorado_class_maryland"},
        }
      },
      //Rank VII (ok)
      {
        name: "VII",
        grid: [
          [1,1,0,0,0],
          [0,1,0,0,0],
        ],
        vehicles: {
          1: {id: "us_battleship_north_carolina_class"},
          2: {id: "us_battleship_south_dakota"},
          3: {id: "us_battleship_iowa_class_iowa"},
        }
      },
    ]
  },

  "USA_Cotier": { //ok
    name: "Bateau côtier USA",
    ranks: [
    {
        name: "I",
        grid: [
          [1,1,0,1,0],
          [1,1,0,0,0],
        ],
        vehicles: {
          1: {id: "us_pt6"},
          2: {id: "us_elco_77ft_pt20"},
          3: {id: "us_pt3"},
          4: {id: "us_nasty_ptf"},
          5: {id: "us_huckins_78ft_pt95"},
        }
      },
      {
        name: "II",
        grid: [
          [1,1,0,1,1],
          [1,1,0,1,1],
        ],
        vehicles: {
          1: {id: "us_elco_80ft_pt_boat"},
          2: {id: "us_pc_451"},
          3: {id: "us_pc_466_carmi"},
          4: {id: "us_huckins_78ft_pt262"},
          5: {id: "us_higgins_78ft_pt71"},
          6: {id: "us_sc_497"},
          7: {id: "us_elco_80ft_pt174"},
          8: {id: "us_elco_80ft_pt109_boat"},
        }
      },
      {
        name: "III",
        grid: [
          [1,1,1,1,1],
          [1,1,0,1,1],
        ],
        vehicles: {
          1: {id: "us_elco_80ft_pt_boat_mod01"},
          2: {id: "us_higgins_78ft_pt625"},
          3: {id: "us_pgm_59_class"},
          4: {id: "us_lcm_zippo"},
          5: {id: "us_higgins_78ft_pt658"},
          6: {id: "us_elco_80ft_pt_boat_mod02"},
          7: {id: "us_elco_77ft_pt59"},
          8: {id: "us_elco_80ft_pt_boat_thunderbolt"},
          9: {id: "us_flagstaff_pgh1"},
        }
      },
      {
        name: "IV",
        grid: [
          [1,1,1,1,0],
          [1,1,0,1,0],
        ],
        vehicles: {
          1: {id: "us_tucumcari_pgh2"},
          2: {id: "us_ashville_class"},
          3: {id: "us_pgm_9_class"},
          4: {id: "us_pt811"},
          5: {id: "us_pt812"},
          6: {id: "us_admirable_class"},
          7: {id: "us_ashville_class_douglas"},
        }
      },
      {
        name: "V",
        grid: [
          [1,1,1,0,0],
          [1,1,0,0,0],
          [1,0,0,0,0],
        ],
        vehicles: {
          1: {id: "us_pt810"},
          2: {id: "us_lcs_l_3"},
          3: {id: "us_cyclone_class_cyclone"},
          4: {id: "us_frigate_tacoma"},
          5: {id: "us_frigate_buckley_class_coolbaugh"},
          6: {id: "us_frigate_dealey"},
        }
      },
    ]
  },

  // Allemagne
  "Germany_Avion": { //ok
    name: "Aviation Allemande",
    ranks: [
      //Rank I (ok)
      {
        name: "I",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1],
          [0, 1, 0, 1, 1, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 0],
        ],
        vehicles: {
          1: {id: "bf-109b_2"},
          2: {id: "he-51_group", children: [{id: "he51a1"}, {id: "he51b1"}, {id: "he51c1"}, {id: "he51c1_late"}]},
          3: {id: "do_17z_7"},
          4: {id: "hs-123a-1"},
          5: {id: "do_17_group", children: [{id: "do_17e_1"}, {id: "do_17z_2"}]},
          6: {id: "bf-109a_1"},
          7: {id: "he51b_2w"},
          8: {id: "bf-109c_1"},
          9: {id: "he_112_group", children: [{id: "he_112v_5"}, {id: "he_112a_0"}]},
          10: {id: "do_217j_group", children: [{id: "do_217j_1"}, {id: "do_217j_2"}]},
          11: {id: "ju-87br_group", children: [{id: "ju-87b-2"}, {id: "ju-87r-2"}]},
          12: {id: "he_111_bv_138_group", children: [{id: "he_115c_1"}, {id: "bv-138c-1"}]},
          13: {id: "ju-87r-2_snake"},
          14: {id: "arado-196a-3"},
          15: {id: "he_100d_1"},
          16: {id: "ju-87g_group", children: [{id: "ju-87g_1"}, {id: "ju-87g_2"}]},
          17: {id: "he-111h-2"},
          18: {id: "fiat_cr42_marcolin"},
          19: {id: "bf-109c_1_promo"},
          20: {id: "fiat_group", children: [{id: "fiat_cr42"}, {id: "fiat_g50_seria2"}, {id: "fiat_g50_seria7as"}]},
          21: {id: "fw-189a-1"},
          22: {id: "mc200_serie3", children: [{id: "mc200_serie3"}, {id: "mc200_serie7"}, {id: "mc-202"}]},
        }
      },
      //rank II (ok)
      {
        name: "II",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 0, 1],
          [0, 0, 0, 0, 0, 0, 1]
        ],
        vehicles: {
          1: {id: "bf-109e-1"},
          2: {id: "he_112b_0"},
          3: {id: "ju-88c-6"},
          4: {id: "hs-129_group", children: [{id: "hs-129b-3"}, {id: "hs-129b-2"}]},
          5: {id: "fw_200c_1"},
          6: {id: "he_112b_1"},
          7: {id: "fw_189c_0"},
          8: {id: "bf-109e_group", children: [{id: "bf-109e-3"}, {id: "bf-109e-4"}]},
          9: {id: "c_3604"},
          10: {id: "do_217n_group", children: [{id: "do_217n_1"}, {id: "do_217n_2"}]},
          11: {id: "ju-87d_group", children: [{id: "ju-87d-3"}, {id: "ju-87d-5"}]},
          12: {id: "ju-88a_group", children: [{id: "ju-88a-1"}, {id: "ju-88a-4"}]},
          13: {id: "il_2_1942_luftwaffe"},
          14: {id: "wellington_mk1c_luftwaffe"},
          15: {id: "bf-109f_early_group", children: [{id: "bf-109f-1"}, {id: "bf-109f-2"}]},
          16: {id: "fw-190a-1"},
          17: {id: "bf_110cf_group", children: [{id: "bf-110c-4"}, {id: "bf-110f-2"}]},
          18: {id: "me-410a-1_group", children: [{id: "me_210a_1"}, {id: "me-410a-1_u4"}, {id: "me-410b-2_u4"}]},
          19: {id: "he-111h_group", children: [{id: "he-111h-6"}, {id: "he-111h-16_winter"}]},
          20: {id: "bf_109t_2"},
          21: {id: "he_112b_2"},
          22: {id: "yak-1b_luftwaffe"},
          23: {id: "h-75a-2_finland"},
          24: {id: "bv-238"},
          25: {id: "bf-109e-7"},
          26: {id: "bf-110c-6"},
          27: {id: "sm-79_group", children: [{id: "sm_79_1936"}, {id: "sm_79_1939"}, {id: "sm_79_1941"}, {id: "sm_79_1943"}, {id: "sm_79_iar"}, {id: "sm_79_1937"}, {id: "sm_79_1942"}]},
        }
      },
      // Rank III (ok)
      {
        name: "III",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 1, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1]
        ],
        vehicles: {
          1: {id: "bf-109f_group", children: [{id: "bf-109f-4"}, {id: "bf-109f-4_trop"}]},
          2: {id: "fw-190a-5_group", children: [{id: "fw-190a-4"}, {id: "fw-190a-5_u2"}]},
          3: {id: "bf_110g_group", children: [{id: "bf-110g-2"}, {id: "bf_110g_4"}]},
          4: {id: "me-410a_group", children: [{id: "me-410a-1"}, {id: "me-410b-1"}]},
          5: {id: "me_264"},
          6: {id: "p-47d_16_re_germany"},
          7: {id: "hs-129b-2_romania"},
          8: {id: "fw-190d-9"},
          9: {id: "me-410a_group", children: [{id: "me-410a-1_u2"}, {id: "me-410b-1_u2"}]},
          10: {id: "do_335_group", children: [{id: "do_335a_1"}, {id: "do_335a_0"}]},
          11: {id: "do_217e_group", children: [{id: "do_217e_2"}, {id: "do_217e_4"}]},
          12: {id: "ta_154a_1"},
          13: {id: "p-47d_luftwaffe"},
          14: {id: "fw_190a_5_u14"},
          15: {id: "la-5fn_luftwaffe"},
          16: {id: "bf-109g-2_romania"},
          17: {id: "bv-155b-1"},
        }
      },
      // Rank IV (OK)
      {
        name: "IV",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 0, 1, 1, 1, 1],
          [1, 1, 0, 0, 1, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
        ],
        vehicles: {
          1: {id: "bf-109g_2_group", children: [{id: "bf-109g-2"}, {id: "bf-109g-6"}]},
          2: {id: "fw-190a-5_group", children: [{id: "fw-190a-4"}, {id: "fw-190a-5_u2"}]},
          3: {id: "me-410b-6_r3"},
          4: {id: "fw-190f-8"},
          5: {id: "do_217k_group", children: [{id: "do_217k_1"}, {id: "do_217m_1"}]},
          6: {id: "he_219a_7"},
          7: {id: "ia_58a_pucara"},
          8: {id: "bf-109g_group", children: [{id: "bf-109g-14"}, {id: "bf-109g-10"}]},
          9: {id: "fw-190d_group", children: [{id: "fw-190a-5"}, {id: "fw-190d-12"}]},
          10: {id: "me-262a-1a_u4"},
          11: {id: "ju-188a-2"},
          12: {id: "do_335b_2"},
          13: {id: "bf-109z"},
          14: {id: "bf-109k-4"},
          15: {id: "ta-152_group", children: [{id: "ta-152h-1"}, {id: "ta-152c"}]},
          16: {id: "he-177a-5"},
          17: {id: "tempest_mkv_luftwaffe"},
          18: {id: "ju-388j"},
          19: {id: "ju-288c"},
          20: {id: "fw-190c"},
          21: {id: "he-177a-3"},
          22: {id: "fw-190d-13"},
        }
      },
      // Rank V (ok)
      {
        name: "V",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 0, 0, 1, 1, 1],
          [0, 0, 0, 0, 0, 1, 0],
        ],
        vehicles: {
          1: {id: "me-262c_group", children: [{id: "me-262a-1a"}, {id: "me-262c-1a"}, {id: "me-262c-2b"}]},
          2: {id: "he-162a-2"},
          3: {id: "go229_v3"},
          4: {id: "me-262a-1a_early"},
          5: {id: "arado_234_group", children: [  {id: "arado-234"},    {id: "arado-234c-3"},  ]},
          6: {id: "me-262a1_u1"},
          7: {id: "he-162a-1"},
          8: {id: "me-163_group", children: [{id: "me-163b"}, {id: "f-86f-25"}]},
          9: {id: "mig-15bis_nr23_german"},
          10: {id: "il_28_german"},
          11: {id: "sea_hawk_mk100"},
          12: {id: "me-262a-2a"},
          13: {id: "fiat_g91_r4_german"},
        }
      },
      //Rank VI (ok)
      {
        name: "VI",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 0, 1, 1],
        ],
        vehicles: {
          1: {id: "f-86_german_group", children: [{id: "f-86_canadair_german"}, {id: "f-86_cl_13b_mk6"}]},
          2: {id: "mig-17p_lim_5p"},
          3: {id: "fiat_g91_r3"},
          4: {id: "f-84f_germany"},
          5: {id: "hunter_f58a_1971_switzerland"},
          6: {id: "hunter_f58_switzerland"},
          7: {id: "alpha_jet_a_jabog41"},
          8: {id: "f-86k_late_german"},
          9: {id: "mig-19s"},
          10: {id: "alpha_jet_a"},
          11: {id: "mig_23bn"},
          12: {id: "mig-21_sps_k"},
          13: {id: "ffa_p16"},
        }
      },
      //Rank VII (ok)
      {
        name: "VII",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 0, 1, 1, 1, 1],
          [0, 0, 0, 0, 0, 1, 0],
        ],
        vehicles: {
          1: {id: "f-104g"},
          2: {id: "mig-21_mf", children: [{id: "mig-21_mf"}, {id: "mig-21_bis_sau"}]},
          3: {id: "tornado_ids_de_assta1"},
          4: {id: "su_22um3k"},
          5: {id: "mirage_3s_c70_switzerland"},
          6: {id: "mig-21_bis_lazur"},
          7: {id: "f-4f"},
          8: {id: "f-4f_late"},
          9: {id: "mig_23mla"},
          10: {id: "su_22m4"},
          11: {id: "f-5e_switzerland"},
          12: {id: "tornado_ids_de_wtd61"},
          13: {id: "mig_23mf_germany"},
          14: {id: "su_22m4_de_wtd61"},
        }
      },
      //Rank VIII (ok)
      {
        name: "VIII",
        grid: [
          [1, 1, 1, 0, 1, 1, 0],
          [0, 1, 0, 0, 0, 1, 0],
        ],
        vehicles: {
          1: {id: "f-4f_kws_lv"},
          2: {id: "mig_29_9_12_germany"},
          3: {id: "tornado_ids_de_assta3_sle"},
          4: {id: "fa_18c_late_switzerland"},
          5: {id: "tornado_ids_de_mfg"},
          6: {id: "mig_29_9_12g"},
          7: {id: "fa_18c_switzerland"},
        }
      },
      //Rank IX (ok)
      {
        name: "IX",
        grid: [
          [1, 0, 0, 0, 0, 0, 0],
          [1, 0, 0, 0, 0, 0, 0],
        ],
        vehicles: {
          1: {id: "ef_2000_block_10"},
          2: {id: "ef_2000_aesa"},
        }
      },
    ]
  },

  "Germany_Helico": { //ok
    name: "Helicoptère Allemand",
    ranks: [
      {
        name: "V",
        grid: [
          [0,1,1],
          [1,1,0],
        ],
        vehicles: {
          1: {id: "sa_313b"},
          2: {id: "bo_105cb2"},
          3: {id: "uh_1d"},
          4: {id: "mi_8tb"},
        }
      },
      {
        name: "VI",
        grid: [
          [1,1,1],
          [1,1,0],
        ],
        vehicles: {
          1: {id: "bo_105pah1"},
          2: {id: "mi_24d_german"},
          3: {id: "mi_24p_german_hfs80"},
          4: {id: "bo_105pah1_a1"},
          5: {id: "mi_24p_german"},
        }
      },
      {
        name: "VII",
        grid: [
          [1,0,1],
        ],
        vehicles: {
          1: {id: "tiger_uht"},
          2: {id: "tiger_had_spain"},
        }
      },
    ]
  },

  //URSS
  "USSR_Avion": { //ok
    name: "Aviation Russe",
    ranks: [
      //Rank I
      {
        name: "I",
        grid: [
          [0, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 1, 1, 1],
          [0, 1, 0, 1, 1, 1, 1],
          [0, 0, 0, 1, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 0],
        ],
        vehicles: {
          1: {id: "i-16_type5"},
          2: {id: "i-15_group", children: [{id: "i-15_1934"}, {id: "i-15_1935"}, {id: "i-15_1935_moscow"}]},
          3: {id: "po-2"},
          4: {id: "sb_group", children: [{id: "sb_2m_100"}, {id: "sb_2m_103c"}]},
          5: {id: "i-15bis_krasnolutsky"},
          6: {id: "mbr-2"},
          7: {id: "mig_3_series_1_15"},
          8: {id: "i-153_group", children: [{id: "i-15bis"}, {id: "i-153_m62"}]},
          9: {id: "su-2_group", children: [{id: "bb-1"}, {id: "su-2_mv5"}, {id: "su-2_tss1"}, {id: "su-2_m82"}]},
          10: {id: "yak-4"},
          11: {id: "pby-5a_ussr"},
          12: {id: "po-2m"},
          13: {id: "i-16_group", children: [{id: "i-16_type10"}, {id: "i-16_type18"}, {id: "i-16_type24"}]},
          14: {id: "pe-3_group", children: [{id: "pe-3_early"}, {id: "pe-3"}]},
          15: {id: "ar_group ", children: [{id: "ar_2"}, {id: "sb_2m_103u_mv3"}, {id: "sb_2m_105"}, {id: "sb_2m_103u"}, {id: "sb_2m_103_mv3"}]},
          16: {id: "hp52_hampden_tbmk1_ussr_utk1"},
          17: {id: "tb_3_m17_32"},
          18: {id: "yak_2_kabb"},
          19: {id: "tandem_mai"},
          20: {id: "i-153_m62_zhukovskiy"},
          21: {id: "db_lk"},
        }
      },
      //rank II
      {
        name: "II",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1],
          [1, 0, 1, 1, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 0],
        ],
        vehicles: {
          1: {id: "yak-1_group", children: [{id: "yak-1_early"}, {id: "yak-1b"}]},
          2: {id: "mig_3_series_group", children: [{id: "mig_3_series_1_15_bk_pod"}, {id: "mig_3_series_34"}]},
          3: {id: "lagg-3_group", children: [{id: "lagg-3-8"}, {id: "lagg-3-11"}]},
          4: {id: "il_2_1941"},
          5: {id: "db_3_group", children: [{id: "db_3b"}, {id: "il-4"}]},
          6: {id: "lagg-3-4"},
          7: {id: "lagg-3-23"},
          8: {id: "yak-7b"},
          9: {id: "i-16_type27"},
          10: {id: "lagg-3_late_group", children: [{id: "lagg-3-35"}, {id: "lagg-3-66"}]},
          11: {id: "il-2m_group", children: [{id: "il-2i"}, {id: "il_2_37_1943"}]},
          12: {id: "pe-2_group", children: [{id: "pe-2-1"}, {id: "pe-2-31"}, {id: "pe-2-83"}]},
          13: {id: "yak_1_litvyak"},
          14: {id: "i_29"},
          15: {id: "yak-9_group", children: [{id: "yak-9"}, {id: "yak-9b"}]},
          16: {id: "la_5_group", children: [{id: "la-5_type37_early"}, {id: "la-5_type39"}]},
          17: {id: "pe-3_bis"},
          18: {id: "p-40e_ussr"},
          19: {id: "il_2_m82"},
          20: {id: "hurricanemkii_ussr"},
          21: {id: "i_180"},
          22: {id: "i-153p"},
          23: {id: "lagg-3-34"},
          24: {id: "i-16_type28"},
          25: {id: "lagg-i-301"},
          26: {id: "p-39k_1"},
        }
      },
      // Rank III
      {
        name: "III",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1],
          [0, 0, 0, 0, 1, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
        ],
        vehicles: {
          1: {id: "yak-9tk_group", children: [{id: "yak-9t"}, {id: "yak-9k"}]},
          2: {id: "i_185_m82"},
          3: {id: "la-5fn"},
          4: {id: "il-2m_group", children: [{id: "il_2m_1943"}, {id: "il-2m"}]},
          5: {id: "er-2_group", children: [{id: "er-2_m105_mv3"}, {id: "er-2_m105r_lu2b"}, {id: "er-2_m105_tat"}, {id: "er-2_m105r_tat"}]},
          6: {id: "a_20g_30_ussr"},
          7: {id: "il-2m_mstitel"},
          8: {id: "yak-3_group", children: [{id: "yak-3"}, {id: "yak-9u"}]},
          9: {id: "i_185_m71_standard"},
          10: {id: "la-7"},
          11: {id: "su-6_m71"},
          12: {id: "pe-2_late_group", children: [{id: "pe-2-110"}, {id: "pe-2-359"}]},
          13: {id: "p-39n_su"},
          14: {id: "yak-9m"},
          15: {id: "pe-8_m82"},
          16: {id: "p-39q_15"},
          17: {id: "pe-2-205"},
          18: {id: "p-63a-5_ussr"},
          19: {id: "il_8_1944"},
          20: {id: "p-47d_ussr"},
          21: {id: "tis_ma"},
          22: {id: "b_25j_30_vvs_ussr"},
          23: {id: "itp_m1"},
          24: {id: "yak-3_eremin"},
          25: {id: "tu-2_early"},
        }
      },
      // Rank IV
      {
        name: "IV",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 0, 1, 1, 1, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
        ],
        vehicles: {
          1: {id: "yak-9up_group", children: [{id: "yak-3p"}, {id: "yak-9p"}]},
          2: {id: "i_225"},
          3: {id: "la-7b-20"},
          4: {id: "su-6_am42"},
          5: {id: "ach30b_group", children: [{id: "er-2_ach30b_early"}, {id: "er-2_ach30b_late"}]},
          6: {id: "su_6_single"},
          7: {id: "p-63c-5_ussr"},
          8: {id: "yak-3up_group", children: [{id: "yak-3u"}, {id: "yak-9ut"}]},
          9: {id: "la-9"},
          10: {id: "il-10_group", children: [{id: "il-10"}, {id: "il-10_1946"}]},
          11: {id: "tu-2_group", children: [{id: "tu-2"}, {id: "tu-2_postwar"}, {id: "tu-2_postwar_late"}]},
          12: {id: "la-7_dolgushin"},
          13: {id: "p-63a-10_ussr"},
          14: {id: "be_6"},
          15: {id: "su-8"},
          16: {id: "la-11"},
          17: {id: "fw-190d-9_ussr"},
          18: {id: "spitfire_ix_ussr"},
          19: {id: "yak-3t"},
          20: {id: "yak-3_vk107"},
          21: {id: "tu-1"},
        }
      },
      // Rank V
      {
        name: "V",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 0]
        ],
        vehicles: {
          1: {id: "yak-15_group", children: [{id: "yak-15_early"}, {id: "yak-15"}, {id: "yak-17"}]},
          2: {id: "mig-9_group", children: [{id: "mig-9"}, {id: "mig-9_ussr"}]},
          3: {id: "su-9"},
          4: {id: "il_28_group", children: [{id: "il_28"}, {id: "il_28sh"}]},
          5: {id: "tu_4"},
          6: {id: "l_39za"},
          7: {id: "bi"},
          8: {id: "yak-23"},
          9: {id: "mig-15_group", children: [{id: "mig-15_ns23"}, {id: "mig-15"}]},
          10: {id: "la_200_group", children: [{id: "la_200_toriy"}, {id: "la-15"}]},
          11: {id: "tu_14t"},
          12: {id: "su-11"},
          13: {id: "la_174"},
          14: {id: "mig-15bis_ish"},
        }
      },
      //Rank VI
      {
        name: "VI",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 0, 1, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 0, 1],
          [0, 0, 0, 0, 0, 0, 1],
        ],
        vehicles: {
          1: {id: "yak-30d"},
          2: {id: "mig-17"},
          3: {id: "su-7_group.", children: [{id: "su-7b"}, {id: "su-7bkl"}]},
          4: {id: "yak_130_early"},
          5: {id: "yak-28b"},
          6: {id: "mig-17_cuba"},
          7: {id: "tu_95m"},
          8: {id: "yak-38m"},
          9: {id: "mig-19_group", children: [{id: "mig-19pt"}, {id: "mig-21_f13"}]},
          10: {id: "su_25"},
          11: {id: "yak-38"},
          12: {id: "j_22m1a"},
          13: {id: "mig-21_s"},
          14: {id: "mig-21_pfm"},
          15: {id: "su-7bmk"},
          16: {id: "su_25k"},
        }
      },
      //Rank VII
      {
        name: "VII",
        grid: [
          [0, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 0, 1, 1, 1],
          [0, 0, 0, 0, 0, 1, 0],
        ],
        vehicles: {
          1: {id: "mig-21_group", children: [{id: "mig-21_smt"}, {id: "mig-21_bis"}]},
          2: {id: "su_17m2"},
          3: {id: "su_25t"},
          4: {id: "mig_27_group", children: [{id: "mig_27m"}, {id: "mig_27k"}]},
          5: {id: "su_22m3"},
          6: {id: "su_25_558arz"},
          7: {id: "mig-23m_group", children: [{id: "mig_23m"}, {id: "mig_23mld"}]},
          8: {id: "su_17m4"},
          9: {id: "su_24m"},
          10: {id: "mig_25pd"},
          11: {id: "su_25tm"},
          12: {id: "mig_23ml"},
        }
      },
      //Rank VIII
      {
        name: "VIII",
        grid: [
          [1, 1, 1, 1, 1, 1, 0],
          [1, 1, 1, 0, 0, 1, 0],
          [0, 1, 0, 0, 0, 1, 0]
        ],
        vehicles: {
          1: {id: "yak_141"},
          2: {id: "mig_29_9_12"},
          3: {id: "su_27"},
          4: {id: "su_25sm3"},
          5: {id: "su_34"},
          6: {id: "su_33"},
          7: {id: "mig_29kr_9_41r"},
          8: {id: "mig_29_9_13"},
          9: {id: "su_27sm"},
          10: {id: "su_30mk2v_venezuela"},
          11: {id: "mig_29smt_9_19"},
          12: {id: "mig_29m_9_15"},
        }
      },
      //Rank IX
      {
        name: "IX",
        grid: [
          [0, 0, 1, 0, 0, 0, 0],
          [0, 0, 1, 0, 0, 0, 0],
        ],
        vehicles: {
          1: {id: "su_30sm"},
          2: {id: "su_30sm2"},
        }
      },
    ]
  },

  "USSR_Helico": {
    name: "Helicoptère Russe",
    ranks: [
      {
        name: "V",
        grid: [
          [0,1,0,1],
          [1,1,0,0],
        ],
        vehicles: {
          1: {id: ""},
          2: {id: ""},
          3: {id: ""},
          4: {id: ""},
        }
      },
      {
        name: "VI",
        grid: [
          [0,1,0,1],
          [1,1,0,0],
          [0,1,1,0],
        ],
        vehicles: {
          1: {id: ""},
          2: {id: ""},
          3: {id: ""},
          4: {id: ""},
          5: {id: ""},
          6: {id: ""},
        }
      },
      {
        name: "VII",
        grid: [
          [1,1,1,1],
          [0,1,0,0],
        ],
        vehicles: {
          1: {id: ""},
          2: {id: ""},
          3: {id: ""},
          4: {id: ""},
          5: {id: ""},
        }
      },
    ]
  },

  "USSR_Tank": {
    name: "Char Russe",
    ranks: [
      //Rank I
      {
        name: "I",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 0],
        ],
        vehicles: {
          1: {id: ""},
          2: {id: ""},
          3: {id: ""},
          4: {id: ""},
          5: {id: ""},
          6: {id: ""},
          7: {id: ""},
          8: {id: ""},
          9: {id: ""},
          10: {id: ""},
          11: {id: ""},
          12: {id: ""},
          13: {id: ""},
          14: {id: ""},
          15: {id: ""},
          16: {id: ""},
          17: {id: ""},
          18: {id: ""},
          19: {id: ""},
          20: {id: ""},
          21: {id: ""},
          22: {id: ""},
          23: {id: ""},
        }
      },
      //rank II
      {
        name: "II",
        grid: [
          [1,1,1,1,1,1,1],
          [1,1,0,1,1,1,1],
          [1,1,0,1,1,1,1],
          [0,0,0,0,0,1,1],
          [0,0,0,0,0,1,1],
          [0,0,0,0,0,1,1],
          [0,0,0,0,0,1,1],
          [0,0,0,0,0,0,1],
        ],
        vehicles: {
          1: {id: ""},
          2: {id: ""},
          3: {id: ""},
          4: {id: "", children: [{id: ""}, {id: ""}]},
          5: {id: ""},
          6: {id: ""},
          7: {id: ""},
          8: {id: "", children: [{id: ""}, {id: ""}]},
          9: {id: "", children: [{id: ""}, {id: ""}]},
          10: {id: ""},
          11: {id: "", children: [{id: ""}, {id: ""}]},
          12: {id: ""},
          13: {id: ""},
          14: {id: "", children: [{id: ""}, {id: ""}]},
          15: {id: ""},
          16: {id: ""},
          17: {id: "", children: [{id: ""}, {id: ""}]},
          18: {id: ""},
          19: {id: ""},
          20: {id: ""},
          21: {id: ""},
          22: {id: ""},
          23: {id: ""},
          24: {id: ""},
          25: {id: ""},
          26: {id: ""},
          27: {id: ""},
          28: {id: ""},
        }
      },
      // Rank III
      {
        name: "III",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 0],
        ],
        vehicles: {
          1: {id: ""},
          2: {id: "", children: [{id: ""}, {id: ""}]},
          3: {id: ""},
          4: {id: "", children: [{id: ""}, {id: ""}, {id: ""}]},
          5: {id: ""},
          6: {id: ""},
          7: {id: ""},
          8: {id: "", children: [{id: ""}, {id: ""}]},
          9: {id: ""},
          10: {id: ""},
          11: {id: "", children: [{id: ""}, {id: ""}, {id: ""}]},
          12: {id: ""},
          13: {id: ""},
          14: {id: "", children: [{id: ""}, {id: ""}, {id: ""}]},
          15: {id: ""},
          16: {id: ""},
          17: {id: ""},
          18: {id: ""},
          19: {id: ""},
          20: {id: ""},
        }
      },
      // Rank IV
      {
        name: "IV",
        grid: [
          [1,1,1,1,1,1,1],
          [1,1,1,1,1,1,1],
          [0,0,0,0,0,1,1],
          [0,0,0,0,0,1,1],
          [0,0,0,0,0,1,1],
          [0,0,0,0,0,0,1],
        ],
        vehicles: {
          1: {id: ""},
          2: {id: ""},
          3: {id: ""},
          4: {id: ""},
          5: {id: ""},
          6: {id: ""},
          7: {id: ""},
          8: {id: ""},
          9: {id: "", children: [{id: ""}, {id: ""}]},
          10: {id: ""},
          11: {id: "", children: [{id: ""}, {id: ""}]},
          12: {id: ""},
          13: {id: ""},
          14: {id: ""},
          15: {id: ""},
          16: {id: ""},
          17: {id: ""},
          18: {id: ""},
          19: {id: ""},
          20: {id: ""},
          21: {id: ""},
        }
      },
      // Rank V
      {
        name: "V",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1],
          [0, 0, 0, 0, 1, 1, 1],
        ],
        vehicles: {
          1: {id: ""},
          2: {id: ""},
          3: {id: ""},
          4: {id: "", children: [{id: ""}, {id: ""}]},
          5: {id: ""},
          6: {id: ""},
          7: {id: ""},
          8: {id: "", children: [{id: ""}, {id: ""}, {id: ""}]},
          9: {id: ""},
          10: {id: "", children: [{id: ""}, {id: ""}]},
          11: {id: ""},
          12: {id: ""},
          13: {id: ""},
          14: {id: ""},
          15: {id: ""},
          16: {id: ""},
          17: {id: ""},
        }
      },
      //Rank VI
      {
        name: "VI",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 0, 1, 1],
        ],
        vehicles: {
          1: {id: "", children: [{id: ""},{id: ""}]},
          2: {id: ""},
          3: {id: "", children: [{id: ""},{id: ""}]},
          4: {id: "", children: [{id: ""},{id: ""}]},
          5:{id: ""},
          6: {id: ""},
          7: {id: ""},
          8: {id: "", children: [{id: ""},{id: ""}]},
          9: {id: ""},
          10: {id: "", children: [{id: ""},{id: ""}]},
          11: {id: ""},
          12: {id: ""},
          13: {id: ""},
          14: {id: ""},
          15: {id: ""},
          16: {id: ""},
          17: {id: ""},
          18: {id: ""},
          19: {id: ""},
          20: {id: ""},
        }
      },
      //Rank VII
      {
        name: "VII",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 0, 1, 1, 1, 1],
          [1, 0, 0, 0, 1, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 0, 1],
        ],
        vehicles: {
          1: {id: "", children: [{id: ""}, {id: ""}]},
          2: {id: "", children: [{id: ""}, {id: ""}]},
          3: {id: "", children: [{id: ""}, {id: ""}]},
          4: {id: ""},
          5: {id: "", children: [{id: ""}, {id: ""}]},
          6: {id: ""},
          7: {id: ""},
          8: {id: ""},
          9: {id: ""},
          10: {id: ""},
          11: {id: ""},
          12: {id: ""},
          13: {id: ""},
          14: {id: ""},
          15: {id: ""},
          16: {id: ""},
          17: {id: ""},
          18: {id: ""},
          19: {id: ""},
          20: {id: ""},
          21: {id: ""},
          22: {id: ""},
          23: {id: ""},
          24: {id: ""},
        }
      },
      //Rank VIII
      {
        name: "VIII",
        grid: [
          [1,1,0,0,1,0,0],
          [1,0,0,0,1,0,0],
          [1,0,0,0,1,0,0]
        ],
        vehicles: {
          1: {id: ""},
          2: {id: ""},
          3: {id: ""},
          4: {id: ""},
          5: {id: ""},
          6: {id: ""},
          7: {id: ""},
        }
      }
    ]
  },

  "USSR_Bateau": {
    name: "Bateau haute mer Russe",
    ranks: [
      // Rank I
      {
        name: "I",
        grid: [
          [1,1,1,0],
          [1,1,0,0],
        ],
        vehicles: {
          1: {id: ""},
          2: {id: ""},
          3: {id: ""},
          4: {id: ""},
          5: {id: ""},
        }
      },
      //Rank II
      {
        name: "II",
        grid: [
          [1,1,1,0],
          [1,1,1,0],
        ],
        vehicles: {
          1: {id: ""},
          2: {id: ""},
          3: {id: ""},
          4: {id: ""},
          5: {id: ""},
          6: {id: ""},
        }
      },
      //Rank III
      {
        name: "III",
        grid: [
          [1,1,1,1],
          [1,1,1,1],
          [1,1,0,1],
        ],
        vehicles: {
          1: {id: ""},
          2: {id: ""},
          3: {id: ""},
          4: {id: ""},
          5: {id: ""},
          6: {id: ""},
          7: {id: ""},
          8: {id: ""},
          9: {id: ""},
          10: {id: ""},
          11: {id: ""},
        }
      },
      //Rank IV
      {
        name: "IV",
        grid: [
          [1,1,1,1],
          [1,1,1,0]
        ],
        vehicles: {
          1: {id: ""},
          2: {id: ""},
          3: {id: ""},
          4: {id: ""},
          5: {id: "", children: [{id: ""}, {id: ""}, {id: ""}]},
          6: {id: ""},
        }
      },
      //Rank V
      {
        name: "V",
        grid: [
          [1,1,1,1],
          [1,1,1,1],
        ],
        vehicles: {
          1: {id: ""},
          2: {id: ""},
          3: {id: ""},
          4: {id: ""},
          5: {id: ""},
          6: {id: ""},
          7: {id: ""},
          8: {id: ""},
        }
      },
      //Rank VI
      {
        name: "VI",
        grid: [
          [1,1,1,0],
          [1,1,0,0],
        ],
        vehicles: {
          1: {id: ""},
          2: {id: ""},
          3: {id: ""},
          4: {id: ""},
          5: {id: ""},
        }
      },
      //Rank VII
      {
        name: "VII",
        grid: [
          [1,0,0,0],
        ],
        vehicles: {
          1: {id: ""},
        }
      },
    ]
  },

  //Japon
  "Japan_Avion": {
    name: "Aviation Japonaise",
    ranks: [
      //Rank I (ok)
      {
        name: "I",
        grid: [
          [1, 1, 1, 1, 1, 1, 0],
          [1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 0, 0],
        ],
        vehicles: {
          1: {id: "f1m2"},
          2: {id: "ki-10_group", children: [{id: "ki_10_1"}, {id: "ki_10_2"}, {id: "ki_10_1_commander"}, {id: "ki_10_2_commander"}]},
          3: {id: "ki-45_eraly_group", children: [{id: "ki-45_tei"}, {id: "ki-45_otsu"}]},
          4: {id: "b5n2"},
          5: {id: "ki_32"},
          6: {id: "a5m4_hagiri"},
          7: {id: "a5m4"},
          8: {id: "ki-27_otsu"},
          9: {id: "ki-45_group", children: [{id: "ki-45_ko"}, {id: "ki-45_hei"}]},
          10: {id: "d3a1"},
          11: {id: "ki_21_1ko"},
          12: {id: "ki-27_otsu_ep"},
          13: {id: "ki-43_group", children: [{id: "ki_43_1"}, {id: "ki_43_2"}]},
          14: {id: "ki_109"},
          15: {id: "b6n1"},
          16: {id: "h6k4"},
        }
      },
      //rank II (ok)
      {
        name: "II",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1],
          [0, 0, 0, 1, 1, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 0],
        ],
        vehicles: {
          1: {id: "a6m2_n1k1_group", children: [{id: "a6m2_n_zero"}, {id: "n1k1_kyuofu"}]},
          2: {id: "ki_44_group", children: [{id: "ki_44_1"}, {id: "ki_61_1a_ko"}]},
          3: {id: "j1n1_mod11_early"},
          4: {id: "b6n_group", children: [{id: "b6n2"}, {id: "b6n2a"}]},
          5: {id: "g4m1"},
          6: {id: "a7he1"},
          7: {id: "ki_48_2_otsu"},
          8: {id: "a6m2_group", children: [{id: "a6m2_mod11"}, {id: "a6m2_zero"}]},
          9: {id: "ki_61_group", children: [{id: "ki_44_2_hei"}, {id: "ki_61_1a_otsu"}]},
          10: {id: "ki_102_otsu"},
          11: {id: "d4y_group", children: [{id: "d4y1"}, {id: "d4y2"}]},
          12: {id: "h8k2"},
          13: {id: "ki_44_1_ep"},
          14: {id: "ki_21_1hei"},
          15: {id: "d4y3"},
          16: {id: "ki_49_1_group", children: [{id: "ki-49_1"}, {id: "ki-49_2a"}]},
          17: {id: "ki_44_2_otsu"},
          18: {id: "bf-109e-3_japan"},
          19: {id: "me_210_v22_japan"},
          20: {id: "f4u-1a_japan"},
          21: {id: "h8k3"},
        }
      },
      // Rank III (ok)
      {
        name: "III",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 0, 1, 1, 0],
        ],
        vehicles: {
          1: {id: "a6m3_mod22_group", children: [{id: "a6m3_zero"}, {id: "a6m3_mod22_zero"},{id: "a6m3_mod22ko_zero"}]},
          2: {id: "ki_43_3_otsu"},
          3: {id: "ki_108"},
          4: {id: "p1y1_mod11"},
          5: {id: "ki_49_2_group", children: [{id: "ki-49_2b"}, {id: "ki-49_2b_late"}]},
          6: {id: "ki-96"},
          7: {id: "p-51c-11-nt_japan"},
          8: {id: "a6m5_zero"},
          9: {id: "ki_61_late_group", children: [{id: "ki_61_1a_tei"}, {id: "ki_61_2_early"}]},
          10: {id: "j2m2"},
          11: {id: "b7a2"},
          12: {id: "g5n1"},
          13: {id: "ki_100_2"},
          14: {id: "b7a2_homare_23"},
          15: {id: "ki_100_early"},
          16: {id: "j5n1"},
          17: {id: "ki_67_group", children: [{id: "ki_67_1_ko"}, {id: "ki_67_1_otsu"}]},
          18: {id: "sb2c_5_thailand"},
        }
      },
      // Rank IV (ok)
      {
        name: "IV",
        grid: [
          [1, 1, 1, 0, 1, 1, 1],
          [1, 1, 1, 0, 0, 1, 1],
          [1, 1, 1, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 1, 0],
        ],
        vehicles: {
          1: {id: "a6m5_group", children: [{id: "a6m5otsu"}, {id: "a6m5hei"}]},
          2: {id: "ki_61_1a_hei"},
          3: {id: "j7w1"},
          4: {id: "g8n1"},
          5: {id: "b-17e_japan"},
          6: {id: "a6m6c"},
          7: {id: "a7m2"},
          8: {id: "ki_84_group", children: [{id: "ki_84_ko"}, {id: "ki_84_otsu"}]},
          9: {id: "j2m_group", children: [{id: "j2m3"}, {id: "j2m5"}]},
          10: {id: "a7m1"},
          11: {id: "fw-190a-5_japan"},
          12: {id: "n1k2_group", children: [{id: "n1k1_ja"}, {id: "n1k2_j"},{id: "n1k2_jko"}]},
          13: {id: "ki_84_hei"},
          14: {id: "ki-83"},
          15: {id: "a6m5ko"},
          16: {id: "ki_94_2"},
          17: {id: "ki_61_1a_hei_ep"},
          18: {id: "ki_87"},
          19: {id: "j2m4_kai"},
          20: {id: "j6k1"},
          21: {id: "j2m5_30mm"},
        }
      },
      // Rank V (ok)
      {
        name: "V",
        grid: [
          [1, 1, 1, 1, 0, 1, 0],
          [1, 0, 1, 0, 0, 0, 0],
        ],
        vehicles: {
          1: {id: "kitsuka"},
          2: {id: "j8m1"},
          3: {id: "l_39za_art_thailand"},
          4: {id: "r2y2_group", children: [  {id: "r2y2_v1"},    {id: "r2y2_v2"},   {id: "r2y2_kai"},  ]},
          5: {id: "f-86f-40_japan_blue_impulse"},
          6: {id: "f-86_japan_group", children: [  {id: "f-86f-30_japan"},    {id: "f-86f-40_japan"},  ]},
          7: {id: "f-84g_thailand"},
        }
      },
      //Rank VI (ok)
      {
        name: "VI",
        grid: [
          [1, 1, 1, 0, 0, 1, 0],
          [0, 0, 1, 1, 0, 1, 0],
        ],
        vehicles: {
          1: {id: "f-104j"},
          2: {id: "t2"},
          3: {id: "alpha_jet_a_thailand"},
          4: {id: "t2_early"},
          5: {id: "f1"},
          6: {id: "alpha_jet_th_phase_1"},
          7: {id: "av_8s_thailand"},
        }
      },
      //Rank VII (ok)
      {
        name: "VII",
        grid: [
          [1, 1, 1, 0, 0, 1, 1],
          [0, 1, 1, 0, 0, 1, 0],
        ],
        vehicles: {
          1: {id: "f-4ej"},
          2: {id: "a_7e_thailand"},
          3: {id: "f-5a_thailand"},
          4: {id: "f-5e_fcu_thailand"},
          5: {id: "f-4ej_adtw"},
          6: {id: "av_8s_late_thailand"},
          7: {id: "f-5t_thailand"},
          8: {id: "hawk_209_indonesia"},
        }
      },
      //Rank VIII (ok)
      {
        name: "VIII",
        grid: [
          [1, 1, 1, 0, 1, 1, 0],
          [1, 1, 1, 0, 1, 0, 0],
        ],
        vehicles: {
          1: {id: "f-4ej_kai"},
          2: {id: "f_16aj"},
          3: {id: "f_5_f_16_thailand_group", children: [  {id: "f-5th_thailand"},    {id: "f_16a_block_15_ocu_thailand"},  ]},
          4: {id: "mig_29n"},
          5: {id: "f_2a_adtw"},
          6: {id: "f_15j_group", children: [  {id: "f_15j"}, {id: "f_15j_kai"},  ]},
          7: {id: "f_2a"},
          8: {id: "saab_jas39c_thailand"},
          9: {id: "fa_18d_late_malaysia"},
        }
      },
      //Rank IX (ok)
      {
        name: "IX",
        grid: [
          [0, 0, 0, 0, 1, 0, 0],
        ],
        vehicles: {
          1: {id: "su_30mkm"},
        }
      },
    ]
  },

  //Chine
  "China_Helico": { //ok
    name: "Helicoptère Chine",
    ranks: [
      {
        name: "V",
        grid: [
          [1,0,0],
          [0,1,0],
        ],
        vehicles: {
          1: {id: "z_11wa"},
          2: {id: "sa_342l_china"},
        }
      },
      {
        name: "VI",
        grid: [
          [1,1,1],
          [1,1,1],
          [1,0,0],
        ],
        vehicles: {
          1: {id: "z_9w"},
          2: {id: "oh_58d_china"},
          3: {id: "mi_35m_pakistan"},
          4: {id: "z_9wa"},
          5: {id: "ah_1w_china"},
          6: {id: "z_19e"},
          7: {id: "z_19"},
        }
      },
      {
        name: "VII",
        grid: [
          [1,1,1],
          [1,0,0],
        ],
        vehicles: {
          1: {id: "z_10"},
          2: {id: "ah_64e_china"},
          3: {id: "z_10a"},
          4: {id: "z_10me"},
        }
      },
    ]
  },

  //Italie
  "Italy_Helico": { //ok
    name: "Helicoptère Allemand",
    ranks: [
      {
        name: "V",
        grid: [
          [1,0],
          [1,0],
        ],
        vehicles: {
          1: {id: "ab_205a_1"},
          2: {id: "mi_24d_hungary"},
        }
      },
      {
        name: "VI",
        grid: [
          [1,1],
          [1,1],
          [0,1]
        ],
        vehicles: {
          1: {id: "a_109_eoa2"},
          2: {id: "t_129_atak"},
          3: {id: "mi_24v_hungary"},
          4: {id: "mi_24p_hungary"},
          5: {id: "a_129_a"},
        }
      },
      {
        name: "VII",
        grid: [
          [1,0],
          [1,0]
        ],
        vehicles: {
          1: {id: "a_129_cbt"},
          2: {id: "a_129_d"},
        }
      },
    ]
  },

  //France
  "France_Cotier": { //ok
    name: "Bateau côtier France",
    ranks: [
      {
        name: "I",
        grid: [
          [1,1,1,0],
          [1,0,1,0],
          [1,0,0,0]
        ],
        vehicles: {
          1: {id: "fr_vtb_group", children: [{id: "fr_vtb8"},  {id: "fr_vtb11"},  {id: "fr_vtb14"}]},
          2: {id: "fr_vtb13"},
          3: {id: "fr_vtb10"},
          4: {id: "fr_vtb12_mod"},
          5: {id: "fr_vtb9"},
          6: {id: "fr_vtb18"},
        }
      },
      {
        name: "II",
        grid: [
          [1,1,0,0],
          [0,1,0,0],
        ],
        vehicles: {
          1: {id: ""},
          2: {id: ""},
          3: {id: ""},
        }
      },
      {
        name: "III",
        grid: [
          [1,1,1,1,1],
          [1,1,0,1,1],
        ],
        vehicles: {
          1: {id: "us_elco_80ft_pt_boat_mod01"},
          2: {id: "us_higgins_78ft_pt625"},
          3: {id: "us_pgm_59_class"},
          4: {id: "us_lcm_zippo"},
          5: {id: "us_higgins_78ft_pt658"},
          6: {id: "us_elco_80ft_pt_boat_mod02"},
          7: {id: "us_elco_77ft_pt59"},
          8: {id: "us_elco_80ft_pt_boat_thunderbolt"},
          9: {id: "us_flagstaff_pgh1"},
        }
      },
      {
        name: "IV",
        grid: [
          [1,1,1,1,0],
          [1,1,0,1,0],
        ],
        vehicles: {
          1: {id: "us_tucumcari_pgh2"},
          2: {id: "us_ashville_class"},
          3: {id: "us_pgm_9_class"},
          4: {id: "us_pt811"},
          5: {id: "us_pt812"},
          6: {id: "us_admirable_class"},
          7: {id: "us_ashville_class_douglas"},
        }
      },
      {
        name: "V",
        grid: [
          [1,1,1,0,0],
          [1,1,0,0,0],
          [1,0,0,0,0],
        ],
        vehicles: {
          1: {id: "us_pt810"},
          2: {id: "us_lcs_l_3"},
          3: {id: "us_cyclone_class_cyclone"},
          4: {id: "us_frigate_tacoma"},
          5: {id: "us_frigate_buckley_class_coolbaugh"},
          6: {id: "us_frigate_dealey"},
        }
      },
    ]
  },

  //Suede
  "Sweden_Avion": { //ok
    name: "Aviation Suédoise",
    ranks: [
      //Rank I (ok)
      {
        name: "I",
        grid: [
          [1, 1, 1, 1, 1, 0],
          [1, 1, 1,0,1, 0],
        ],
        vehicles: {
          1: {id: "gladiator_j8a", children: [{id: "gladiator_j8a"},{id: "j6b"}]},
          2: {id: "saab_b17bs"},
          3: {id: "he_115a_2_sweden"},
          4: {id: "fokker_d21_serie3_finland"},
          5: {id: "gladiator_j8a_iacobi"},
          6: {id: "fiat_cr42_j11"},
          7: {id: "saab_b17a_group", children: [{id: "saab_b17b"}, {id: "saab_b17a"}]},
          8: {id: "saab_b3c"},
          9: {id: "arado-196a-5"},
        }
      },
      //rank II (ok)
      {
        name: "II",
        grid: [
          [1,0, 1, 1, 1, 1],
          [1,0, 1, 1, 1, 1]
        ],
        vehicles: {
          1: {id: "re_2000_j20"},
          2: {id: "saab_b18a"},
          3: {id: "b_239_finland"},
          4: {id: "fokker_d21_mod20"},
          5: {id: "j9_early"},
          6: {id: "ffvs_j22_a"},
          7: {id: "ju-88a-4_finland"},
          8: {id: "hurricane_mk1_late_finland"},
          9: {id: "morko_morane"},
          10: {id: "vl_myrsky_2_late"},
        }
      },
      // Rank III (ok)
      {
        name: "III",
        grid: [
          [1, 1, 1, 1, 1, 1],
          [0, 1, 1,0, 1,0]
        ],
        vehicles: {
          1: {id: "ffvs_j22_b"},
          2: {id: "mosquito_f_mk2_norway"},
          3: {id: "saab_b18b"},
          4: {id: "p-51d-20-na_j26"},
          5: {id: "p-51b_7_sweden"},
          6: {id: "mosquito_j30_sweden"},
          7: {id: "mosquito_norway_group", children: [{id: "mosquito_fb_mk6_norway"}, {id: "mosquito_fb_mk6_ash_norway"}]},
          8: {id: "saab_t18b_group", children: [{id: "saab_t18b_1"}, {id: "saab_t18b_2"}]},
          9: {id: "pyorremyrsky"}
        }
      },
      // Rank IV (ok)
      {
        name: "IV",
        grid: [
          [1, 1, 0, 1, 1, 0],
        ],
        vehicles: {
          1: {id: "saab_j21a_group", children: [{id: "saab_j21a_1"}, {id: "saab_j21a_2"}]},
          2: {id: "saab_a21a_3"},
          3: {id: "bf_109g_sweden_group", children: [{id: "bf-109g-2_finland"}, {id: "bf-109g-6_erla_finland"}]},
          4: {id: "bf-109g-6_finland"},
        }
      },
      // Rank V (ok)
      {
        name: "V",
        grid: [
          [1,1,1,1,1,0],
          [1,1,1,0,1,0],
        ],
        vehicles: {
          1: {id: "saab_j21ra"},
          2: {id: "saab_a21rb"},
          3: {id: "saab_sk60b"},
          4: {id: "vampire_fb_group", children: [  {id: "vampire_fb5_j28b"},    {id: "vampire_fb52_finland"},  ]},
          5: {id: "saab_105oe"},
          6: {id: "saab_j29a"},
          7: {id: "saab_j29b"},
          8: {id: "saab_105g"},
          9: {id: "saab_j29d"},
        }
      },
      //Rank VI (ok)
      {
        name: "VI",
        grid: [
          [1,1,0,1,1,0],
          [1,0,0,0,1,0],
        ],
        vehicles: {
          1: {id: "saab_j29f"},
          2: {id: "saab_a32a"},
          3: {id: "hunter_f50_sweden"},
          4: {id: "saab_a32a_red_adam"},
          5: {id: "saab_j32b"},
          6: {id: "saab_j35a"}
        }
      },
      //Rank VII (ok)
      {
        name: "VII",
        grid: [
          [1,1,0,1,1,1],
          [1,1,0,0,1,0],
          [0,0,0,0,1,0],
        ],
        vehicles: {
          1: {id: "saab_j35_group", children: [{id: "saab_j35d"}, {id: "saab_j35j"}]},
          2: {id: "saab_aj37"},
          3: {id: "mig_21_bis_finland"},
          4: {id: "saab_j35xs"},
          5: {id: "saab_ajs37_early"},
          6: {id: "saab_ja37"},
          7: {id: "saab_ajs37"},
          8: {id: "saab_f35_wdns"},
          9: {id: "f-5ag_norway"}
        }
      },
      //Rank VIII (ok)
      {  
        name: "VIII",
        grid: [
          [1,1,0,1,1,0],
          [1,1,0,1,1,0],
        ],
        vehicles: {
          1: {id: "saab_ja37d_group", children: [{id: "saab_ja37d"}, {id: "saab_ja37di"}]},
          2: {id: "f_16a_block_10_norway"},
          3: {id: "fa_18c_finland"},
          4: {id: "saab_ja37di_f21"},
          5: {id: "saab_jas39_group", children: [{id: "saab_jas39a"}, {id: "saab_jas39c"}]},
          6: {id: "f_16am_block_20_mlu_norway"},
          7: {id: "fa_18c_mlu_2_finland"},
          8: {id: "saab_jas39d"}
        }
      },
      //Rank IX (ok)
      {
        name: "IX",
        grid: [
          [1,0,0, 0, 0, 0],
        ],
        vehicles: {
          1: {id: "saab_jas39e"}
        }
      },
    ]
  },

  "Sweden_Helico": { //ok
    name: "Helicoptère Suédois",
    ranks: [
      {
        name: "V",
        grid: [
          [1,0],
          [1,0],
        ],
        vehicles: {
          1: {id: "hkp3c"},
          2: {id: "hkp2"},
        }
      },
     {
        name: "VI",
        grid: [
          [1,1],
          [1,0],
        ],
        vehicles: {
          1: {id: "hkp9a_cb2"},
          2: {id: "mi_28a_sweden"},
          3: {id: "hkp9a_cb3_fc"}
        }
      },
    {
        name: "VII",
        grid: [
          [1,0],
        ],
        vehicles: {
          1: {id: "ahs"}
        }
      },
    ]
  },

  "Sweden_Tank": { //ok 
    name: "Char Suédois",
    ranks: [
      //Rank I (ok)
      {
        name: "I",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1,0, 1, 1, 1, 1],
        ],
        vehicles: {
          1: {id: "sw_strv_m31"},
          2: {id: "sw_strv_m38"},
          3: {id: "sw_pvlvv_fm42"},
          4: {id: "sw_ikv_72"},
          5: {id: "sw_vickers_mk_e_37"},
          6: {id: "sw_strv_m39"},
          7: {id: "sw_strv_m39_td"},
          8: {id: "sw_bt_42"},
          9: {id: "sw_strv_m40l"},
          10: {id: "sw_sav_m43_1944"},
          11: {id: "sw_t_28"},
          12: {id: "sw_vickers_mk_e_45"},
          13: {id: "sw_pbil_m40"},
        }
      },
      //rank II (ok)
      {
        name: "II",
        grid: [
          [1,1,1,1,0,1,1],
          [1,1,1,1,0,1,0]
        ],
        vehicles: {
          1: {id: "sw_strv_m41_s2"},
          2: {id: "sw_lago_1"},
          3: {id: "sw_pbv_301"},
          4: {id: "sw_stormpjas_fm43_44"},
          5: {id: "sw_strv_m41_s1"},
          6: {id: "sw_t_50_fin"},
          7: {id: "sw_pvkv_iii"},
          8: {id: "sw_strv_m42_eh"},
          9: {id: "sw_tgdgb_m40_lv"},
          10: {id: "sw_sav_m43_1946"},
          11: {id: "sw_ikv_73"}
        }
      },
      // Rank III (ok)
      {
        name: "III",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1,0]
        ],
        vehicles: {
          1: {id: "sw_m24_chaffee_dk"},
          2: {id: "sw_pvkv_iv"},
          3: {id: "sw_l_62_anti_ii"},
          4: {id: "sw_pvkv_ikv_group", children: [{id: "sw_pvkv_m43_1946"}, {id: "sw_ikv_103"}]},
          5: {id: "sw_t_34_pz_4_group", children: [{id: "sw_t_34_1941"},{id: "sw_pzkpfw_iv_ausf_j"}]},
          6: {id: "sw_sav_fm48"},
          7: {id: "sw_kv_1_1942_fin"},
          8: {id: "sw_pvkv_ii"},
          9: {id: "sw_strv_m42_delat_torn"},
          10: {id: "sw_lvkv_42"},
          11: {id: "sw_pvkv_m43_1963"},
          12: {id: "sw_pt_76_comet_group", children: [{id: "sw_pt_76b"}, {id: "sw_a_34_comet"}]},
          13: {id: "sw_sherman_3_4"},
        }
      },
      // Rank IV (ok)
      {
        name: "IV",
        grid: [
          [1,1,1,1,1,1,0],
          [0,0,0,0,1,0,0],
        ],
        vehicles: {
          1: {id: "sw_pbv_501"},
          2: {id: "sw_strv_74"},
          3: {id: "sw_landsverk_ush_204_gk"},
          4: {id: "sw_bkan_1c"},
          5: {id: "sw_t_34_85_zis_53"},
          6: {id: "sw_kungstiger"},
          7: {id: "sw_charioteer_mk_7"}
        }
      },
      // Rank V (ok)
      {
        name: "V",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 0, 0, 1, 0],
        ],
        vehicles: {
          1: {id: "sw_ikv_91"},
          2: {id: "sw_strv_81"},
          3: {id: "sw_zsu_57_2"},
          4: {id: "sw_pvrbv_551"},
          5: {id: "sw_t_54_1951"},
          6: {id: "sw_strv_81_rb52"},
          7: {id: "sw_k9_vidar"},
          8: {id: "sw_landsverk_ush_405"},
          9: {id: "sw_strv_101_103a_group", children: [{id: "sw_strv_101"}, {id: "sw_strv_103a"}]},
          10: {id: "sw_veak_40"},
          11: {id: "sw_strv_103_0"},
        }
      },
      //Rank VI
      {
        name: "VI",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 0, 1, 1, 0],
          [1, 0, 0, 0, 0, 0, 0],
        ],
        vehicles: {
          1: {id: "sw_cv_90105"},
          2: {id: "sw_strv_104_103c_group", children: [{id: "sw_strv_104"},{id: "sw_strv_103c"}]},
          3: {id: "sw_itpsv_90"},
          4: {id: "sw_udes_pbv_group", children: [{id: "sw_udes_33"},{id: "sw_pbv_302_bill"}]},
          5:{id: "sw_pbv_302_bill"},
          6: {id: "sw_leopard_1a5no"},
          7: {id: "sw_bmp_2md"},
          8: {id: "sw_ikv_91_105"},
          9: {id: "sw_strv_105"},
          10: {id: "sw_lvrbv_701"},
          11: {id: "sw_t_72m1"},
          12: {id: "sw_cv_9035_dk"},
          13: {id: "sw_cv_90_ifv_group", children: [{id: "sw_cv_9030_fin"},{id: "sw_strf_90b"}]},
        }
      },
      //Rank VII
      {
        name: "VII",
        grid: [
          [1, 1, 1, 1, 1, 1, 1],
          [0, 0, 0, 0, 0, 1, 0],
        ],
        vehicles: {
          1: {id: "sw_strf_90c"},
          2: {id: "sw_strv_121"},
          3: {id: "sw_lvkv_asrad_group", children: [{id: "sw_lvkv_90c"}, {id: "sw_asrad_r"}]},
          4: {id: "sw_strf_9056"},
          5: {id: "sw_leopard_2a4_fin"},
          6: {id: "sw_cv_90105_tml"},
          7: {id: "sw_patria_amv_ctcv_105"},
          8: {id: "sw_strv121b_christian2"},
        }
      },
      //Rank VIII
      {
        name: "VIII",
        grid: [
          [1,1,1,1,1,1,0],
          [0,1,1,0,0,0,0],
          [0,0,1,0,0,0,0]
        ],
        vehicles: {
          1: {id: "sw_cv_90120"},
          2: {id: "sw_strv_122_group", children: [{id: "sw_strv_122"}, {id: "sw_strv_122b_plss"}]},
          3: {id: "sw_crotale_ng"},
          4: {id: "sw_cv_90_mk4"},
          5: {id: "sw_leopard_2a6nl"},
          6: {id: "sw_t_80u"},
          7: {id: "sw_strv_122b_plus"},
          8: {id: "sw_eldenhet_nomads_group", children: [{id: "sw_eldenhet_98"},{id: "sw_nomads"}]},
          9: {id: "sw_nasams_fcs"},
        }
      }
    ]
  },

  //Israel
  "Israel_Avion": { //ok
    name: "Aviation Israel",
    ranks: [
      {
        name: "IV",
        grid: [
          [1,1,1,1],
          [1,1,0,1]
        ],
        vehicles: {
          1: {id: "spitfire_mk9c_iaf"},
          2: {id: "s_199"},
          3: {id: "b-17g_iaf"},
          4: {id: "spitfire_lf_mk9e_weisman"},
          5: {id: "spitfire_lf_mk9e_iaf"},
          6: {id: "p-51d-20-na_iaf"},
          7: {id: "spitfire_lf_mk9c_cw_greece"},
        }
      },
      {
        name: "V",
        grid: [
          [1,1,0,1],
          [1,0,0,1]
        ],
        vehicles: {
          1: {id: "meteor_nfmk13"},
          2: {id: "md_450b_ouragan_iaf"},
          3: {id: "md_450b_ouragan_iaf_29"},
          4: {id: "meteor_fmk8_iaf"},
          5: {id: "meteor_frmk9_iaf"},
        }
      },
      {
        name: "VI",
        grid: [
          [1,1,1,1],
          [1,1,0,1]
        ],
        vehicles: {
          1: {id: "md_454_mystere_4a_iaf"},
          2: {id: "a_4_iaf_group", children: [{id: "a_4h"},  {id: "a_4e_early_iaf"}]},
          3: {id: "so_4050_vautour_iaf_group", children: [{id: "so_4050_vautour_2a_israel_iaf"},  {id: "so_4050_vautour_2n_iaf"}]},
          4: {id: "f-84f_israel_iaf"},
          5: {id: "md_460_iaf_group", children: [{id: "md_460_sambad"},  {id: "md_460_saar"}]},
          6: {id: "a_4n"},
          7: {id: "a_4e_late_iaf"},
        }
      },
      {
        name: "VII",
        grid: [
          [1,1,1,1],
          [1,0,0,1],
          [0,0,0,1]
        ],
        vehicles: {
          1: {id: "mirage_3cj"},
          2: {id: "f-4e_iaf"},
          3: {id: "nesher"},
          4: {id: "kfir_canard"},
          5: {id: "kfir_c7"},
          6: {id: "kfir_c2"},
          7: {id: "mig_21_2000_iaf"},
        }
      },
      {
        name: "VIII",
        grid: [
          [1,1,1,1],
          [1,1,1,1]
        ],
        vehicles: {
          1: {id: "f_16a_block_10_iaf"},
          2: {id: "f_4e_f_15_iaf_group", children: [{id: "f-4e_kurnass_2000"},  {id: "f_15a_iaf"}]},
          3: {id: "f_16d_iaf_group", children: [{id: "f_16d_block_40_barak_2"},  {id: "f_16i_sufa"}]},
          4: {id: "f_16a_block_10_netz_mod"},
          5: {id: "f_16c_block_40_barak_2"},
          6: {id: "f_15c_baz_msip"},
          7: {id: "f_15i_raam"},
          8: {id: "kfir_c10_colombia"},
        }
      },
    ]
  },

  "Israel_Helico": { //ok
    name: "Helicoptère Israelien",
    ranks: [
      {
        name: "V",
        grid: [
          [1,0,0],
          [0,1,0],
        ],
        vehicles: {
          1: {id: "ah_1g_iaf"},
          2: {id: "md_500_tow_late"},
        }
      },
      {
        name: "VI",
        grid: [
          [1,0,1],
          [1,0,0],
          [1,0,0],
        ],
        vehicles: {
          1: {id: "ah_1q_iaf"},
          2: {id: "ah_64a_peten_iaf"},
          3: {id: "ah_1f_iaf"},
          4: {id: "ah_64a_iaf"},
        }
      },
      {
        name: "VII",
        grid: [
          [1,1,0],
        ],
        vehicles: {
          1: {id: "ah_64d_i_saraph"},
          2: {id: "ah_60_iaf"},
        }
      },
    ]
  },
};