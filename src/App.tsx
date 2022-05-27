import React, { ChangeEvent } from 'react';
import { DisplaySet, DisplayItem } from './Components';
import {
	AppProps,
	AppState,
  equipDict
 } from './types';
import { hasKey } from './Utilities';
import { sampleIDs, slots } from './data/defaults';
import { fetchGearset, fetchEquipment } from './data/fetchData';
import './App.css';

class App extends React.Component<AppProps, AppState>{
  constructor(props:any) {
    super(props);
    this.state = {
    src: '',
    sample: 'PLD',
    sets: [],
    equipment: {},
    obtained: {}
    };
    this.setSrc = this.setSrc.bind(this);
    this.getSet = this.getSet.bind(this);
    this.toggleHas = this.toggleHas.bind(this);
  }

  setSrc(e:ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    this.setState({
    src: e.target.value
    });
  }

  async getSet() {
    let id:string;
    if(this.state.src === '') {
      id = sampleIDs[this.state.sample];
    } else {
      id = this.state.src;
    }
    let set = await fetchGearset(id);
    const nSets = [...this.state.sets];
    nSets.push(set);
    let obtained = this.state.obtained;
    obtained[set.id] = {};
    let nEquip: equipDict = this.state.equipment;
    slots.forEach(slot => {
      if(hasKey(set, slot.id) && set[slot.id] &&
      !this.state.equipment[set[slot.id]]) {
        this.getEquip(set[slot.id], nEquip);
        obtained[set.id][slot.id] = false;
      }
    });
    this.setState({
      sets: nSets,
      equipment: nEquip,
      obtained: obtained
    }, () => {setTimeout(() => {this.forceUpdate()}, 1000);});
  }

  async getEquip(id:string, container:equipDict) {
    container[id] = await fetchEquipment(id);
  }

  toggleHas(e:ChangeEvent<HTMLInputElement>, setId:string, itemId:string) {
    let obtained = this.state.obtained;
    obtained[setId][itemId] = !obtained[setId][itemId];
    this.setState({
      obtained: obtained
    });
  }

  render(){
    console.log(this.state.obtained);
    const equip = this.state.equipment;
    return(
    <>
      <nav>
      <label>Etro ID&nbsp;
      <input type='text' onChange={(e)=>this.setSrc(e)} value={this.state.src} />
      </label>&nbsp;or&nbsp;
      <label>Select a sample set&nbsp;
        <select
        value={this.state.sample}
        onChange={(e)=>{this.setState({sample: e.target.value})}}>
        <option value='PLD'>Paladin</option>
        <option value='DRK'>Dark Knight</option>
        <option value='WHM'>White Mage</option>
        <option value='RPR'>Reaper</option>
        <option value='MNK'>Monk</option>
        <option value='MCH'>Machinist</option>
        <option value='SMN'>Summoner</option>
        </select></label>
      <button onClick={this.getSet}>Add Set</button>
      </nav>
      {this.state.sets.map((set, id) =>
        <DisplaySet
          key={id}
          setInfo={set}
          open={this.state.sets.length === 1 ? true : false}>
          {slots.map(slot => hasKey(set, slot.id)  && set[slot.id]
          && equip[set[slot.id]] &&
          <DisplayItem
            key={slot.pretty+id}
            position={slot.pretty}
            name={equip[set[slot.id]].name}
            imgSrc={equip[set[slot.id]].iconPath}
            obtained={this.state.obtained[set.id][slot.id]}
            toggleHas={(e:ChangeEvent<HTMLInputElement>) =>
              this.toggleHas(e, set.id, slot.id)}
            />
          )}
        </DisplaySet>
      )}
    </>
    );
  }
}

export default App;
