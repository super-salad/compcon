import { mapValues } from 'lodash'
import uuid from 'uuid/v4'
import { store } from '@/store'

import {
  Manufacturer,
  CoreBonus,
  Frame,
  MechWeapon,
  MechSystem,
  WeaponMod,
  PilotEquipment,
  PilotWeapon,
  PilotArmor,
  PilotGear,
  Talent,
  Tag,
  NpcClass,
  NpcTemplate,
  NpcFeature,
  NpcWeapon,
  NpcReaction,
  NpcTrait,
  NpcSystem,
  NpcTech,
  Reserve,
} from '@/class'
import * as PlayerAction from '@/classes/Action'
import {
  IManufacturerData,
  ICoreBonusData,
  IFrameData,
  IMechWeaponData,
  IMechSystemData,
  IWeaponModData,
  IPilotEquipmentData,
  IPilotWeaponData,
  IPilotArmorData,
  ITalentData,
  INpcClassData,
  INpcFeatureData,
  INpcTemplateData,
  INpcWeaponData,
  INpcReactionData,
  INpcSystemData,
  INpcTechData,
  ITagCompendiumData,
} from '@/interface'
import { Action } from './Action'
import { Background, IBackgroundData } from './Background'
import { Bond, IBondData } from './pilot/components/bond/Bond'
import { IReserveData, ISkillData, Skill } from './pilot/components'

export interface IContentPackManifest {
  name: string
  item_prefix: string
  author: string
  version: string
  description?: string
  website?: string
  image_url?: string
}
interface IContentPackData {
  manufacturers: IManufacturerData[]
  backgrounds: IBackgroundData[]
  coreBonuses: ICoreBonusData[]
  frames: IFrameData[]
  weapons: IMechWeaponData[]
  systems: IMechSystemData[]
  mods: IWeaponModData[]
  pilotGear: IPilotEquipmentData[]
  talents: ITalentData[]
  tags: ITagCompendiumData[]
  reserves: IReserveData[]
  skills: ISkillData[]

  npcClasses: INpcClassData[]
  npcFeatures: INpcFeatureData[]
  npcTemplates: INpcTemplateData[]

  bonds: IBondData[]

  actions: PlayerAction.IActionData[]

  statuses: Status[]
  environments: Environment[]
  sitreps: Sitrep[]

  tables: any
}

export interface IContentPack {
  id: string
  active: boolean
  manifest: IContentPackManifest
  data: IContentPackData
}

export class ContentPack {
  private _manifest: IContentPackManifest
  private _id: string
  public Key: string
  public get ID(): string {
    return this._id
  }

  public get Name(): string {
    return this._manifest.name
  }
  public get Author(): string {
    return this._manifest.author
  }
  public get Version(): string {
    return this._manifest.version
  }
  public get Description(): string | undefined {
    return this._manifest.description
  }
  public get Website(): string | undefined {
    return this._manifest.website
  }
  public get ImageURL(): string | undefined {
    return this._manifest.image_url
  }

  private _data: IContentPackData

  private _Manufacturers: Manufacturer[] = []
  public get Manufacturers(): Manufacturer[] {
    this._Manufacturers.forEach(x => (x.IsHidden = !this.Active))
    return this._Manufacturers
  }

  private _Backgrounds: Background[] = []
  public get Backgrounds(): Background[] {
    return this._Backgrounds
  }

  private _CoreBonuses: CoreBonus[] = []
  public get CoreBonuses(): CoreBonus[] {
    this._CoreBonuses.forEach(x => (x.IsHidden = !this.Active))
    return this._CoreBonuses
  }

  private _Frames: Frame[] = []
  public get Frames(): Frame[] {
    this._Frames.forEach(x => (x.IsHidden = !this.Active))
    return this._Frames
  }

  private _MechWeapons: MechWeapon[] = []
  public get MechWeapons(): MechWeapon[] {
    this._MechWeapons.forEach(x => (x.IsHidden = !this.Active))
    return this._MechWeapons
  }

  private _MechSystems: MechSystem[] = []
  public get MechSystems(): MechSystem[] {
    this._MechSystems.forEach(x => (x.IsHidden = !this.Active))
    return this._MechSystems
  }

  private _WeaponMods: WeaponMod[] = []
  public get WeaponMods(): WeaponMod[] {
    this._WeaponMods.forEach(x => (x.IsHidden = !this.Active))
    return this._WeaponMods
  }

  private _PilotGear: PilotEquipment[] = []
  public get PilotGear(): PilotEquipment[] {
    this._PilotGear.forEach(x => (x.IsHidden = !this.Active))
    return this._PilotGear
  }

  private _Talents: Talent[] = []
  public get Talents(): Talent[] {
    this._Talents.forEach(x => (x.IsHidden = !this.Active))
    return this._Talents
  }

  private _Tags: Tag[] = []
  public get Tags(): Tag[] {
    return this._Tags
  }

  private _NpcClasses: NpcClass[] = []
  public get NpcClasses(): NpcClass[] {
    return this._NpcClasses
  }

  private _NpcTemplates: NpcTemplate[] = []
  public get NpcTemplates(): NpcTemplate[] {
    return this._NpcTemplates
  }

  private _NpcFeatures: NpcFeature[] = []
  public get NpcFeatures(): NpcFeature[] {
    this._NpcFeatures.forEach(x => (x.IsHidden = !this.Active))
    return this._NpcFeatures
  }

  private _Statuses: Status[] = []
  public get Statuses(): Status[] {
    return this._Statuses
  }

  private _Skills: Skill[] = []
  public get Skills(): Skill[] {
    return this._Skills
  }

  private _Environments: Environment[] = []
  public get Environments(): Environment[] {
    return this._Environments
  }

  private _PlayerActions: Action[] = []
  public get Actions(): Action[] {
    return this._PlayerActions
  }

  private _Sitreps: Sitrep[] = []
  public get Sitreps(): Sitrep[] {
    return this._Sitreps
  }

  private _Tables: any = {}
  public get Tables(): any {
    return this._Tables
  }

  private _Bonds: any = []
  public get Bonds(): any {
    return this._Bonds
  }

  private _Reserves: any = []
  public get Reserves(): any {
    return this._Reserves
  }

  private _active: boolean
  public get Active(): boolean {
    return this._active
  }
  public SetActive(active: boolean): void {
    this._active = active
  }

  constructor(pack: IContentPack) {
    const { id, active, manifest, data } = pack
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    this.Key = uuid()

    self._active = active
    self._manifest = manifest
    self._data = data
    Object.keys(self._data).forEach(key => self._data[key].forEach(item => (item.brew = id)))
    self._id = id

    self._Tags = self._data.tags?.map(x => new Tag(x)) || []

    self._Manufacturers =
      self._data.manufacturers?.map(x => {
        const m = new Manufacturer(x)
        m.setCorsSafe()
        return m
      }) || []
    self._Backgrounds =
      self._data.backgrounds?.map(x => new Background(x, self._manifest.name)) || []
    self._CoreBonuses =
      self._data.coreBonuses?.map(x => new CoreBonus(x, self._data.tags, self._manifest.name)) || []
    self._Frames =
      self._data.frames?.map(x => new Frame(x, self._data.tags, self._manifest.name)) || []
    self.fillLicenseIds(self._Frames, self._Frames)
    self._MechWeapons =
      self._data.weapons?.map(x => new MechWeapon(x, self._data.tags, self._manifest.name)) || []
    self.fillLicenseIds(self._MechWeapons, self._Frames)
    self._MechSystems =
      self._data.systems?.map(x => new MechSystem(x, self._data.tags, self._manifest.name)) || []
    self.fillLicenseIds(self._MechSystems, self._Frames)
    self._WeaponMods =
      self._data.mods?.map(x => new WeaponMod(x, self._data.tags, self._manifest.name)) || []
    self.fillLicenseIds(self._WeaponMods, self._Frames)
    self._PilotGear =
      self._data.pilotGear?.map(function (x) {
        if (x.type.toLowerCase() === 'weapon')
          return new PilotWeapon(x as IPilotWeaponData, self._data.tags, self._manifest.name)
        else if (x.type.toLowerCase() === 'armor')
          return new PilotArmor(x as IPilotArmorData, self._data.tags, self._manifest.name)
        return new PilotGear(x as IPilotEquipmentData, self._data.tags, self._manifest.name)
      }) || []
    self._Talents =
      self._data.talents?.map(x => new Talent(x, self._data.tags, self._manifest.name)) || []

    self._NpcFeatures =
      self._data.npcFeatures?.map(function (x) {
        if (x.type.toLowerCase() === 'weapon')
          return new NpcWeapon(x as INpcWeaponData, self._manifest.name)
        else if (x.type.toLowerCase() === 'reaction')
          return new NpcReaction(x as INpcReactionData, self._manifest.name)
        else if (x.type.toLowerCase() === 'trait') return new NpcTrait(x, self._manifest.name)
        else if (x.type.toLowerCase() === 'system')
          return new NpcSystem(x as INpcSystemData, self._manifest.name)
        return new NpcTech(x as INpcTechData, self._manifest.name)
      }) || []
    self._NpcClasses = self._data.npcClasses?.map(x => new NpcClass(x, self._manifest.name)) || []
    self._NpcTemplates =
      self._data.npcTemplates?.map(x => new NpcTemplate(x, self._manifest.name)) || []

    self._PlayerActions = self._data.actions?.map(
      (x: PlayerAction.IActionData) => new PlayerAction.Action(x)
    )

    self._Skills = self._data.skills?.map(x => new Skill(x)) || []

    self._Statuses = self._data.statuses || []
    self._Environments = self._data.environments || []
    self._Sitreps = self._data.sitreps || []

    self._Tables = self._data.tables || {}

    self._Bonds = self._data.bonds?.map(x => new Bond(x, self._manifest.name)) || []

    self._Reserves = self._data.reserves?.map(x => new Reserve(x, self._manifest.name)) || []
  }

  private fillLicenseIds(target, frames) {
    if (!target.length || !frames.length) return

    target.forEach(x => {
      if (x.LicenseID) return
      const lName = x.Variant || x.License
      if (!lName) return
      let frame = frames.find(f => f.Name.toUpperCase() === lName.toUpperCase())
      if (!frame)
        frame = store.getters
          .getItemCollection('Frames')
          .find(f => f.Name.toUpperCase().includes(lName.toUpperCase()))
      if (!frame) return
      x.SetLicenseID(frame.ID)
    })
  }

  public Serialize(): IContentPack {
    return {
      id: this._id,
      active: this._active,
      manifest: this._manifest,
      data: this._data,
    }
  }
}
