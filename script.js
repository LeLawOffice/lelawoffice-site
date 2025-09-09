// Mobile menu toggle
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('nav-menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true' || false;
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.style.display = expanded ? 'none' : 'flex';
  });
}
// Year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Reservation form handler (on reservations page)
function saveBooking(data){
  const list = JSON.parse(localStorage.getItem('bookings')||'[]');
  list.push({...data, createdAt: new Date().toISOString()});
  localStorage.setItem('bookings', JSON.stringify(list));
}

function makeICS(evt){
  const pad=n=>String(n).padStart(2,'0');
  const dt=new Date(evt.date+"T"+evt.time);
  const dtend=new Date(dt.getTime()+60*60*1000);
  const fmt=d=>`${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  return ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//LE LAW OFFICE//Booking//EN","BEGIN:VEVENT",
    "UID:"+crypto.randomUUID(),"DTSTAMP:"+fmt(new Date()),"DTSTART:"+fmt(dt),"DTEND:"+fmt(dtend),
    "SUMMARY:Consultation - LE LAW OFFICE","DESCRIPTION:"+evt.service+" with "+evt.name+" ("+evt.email+")",
    "LOCATION:9131 Keele Street, Suite A4, Vaughan, ON, L4K 0G7","END:VEVENT","END:VCALENDAR"].join("\r\n");
}

document.addEventListener('DOMContentLoaded', () => {
  const form=document.querySelector('#reservation-form');
  const alertBox=document.querySelector('#reservation-alert');
  if(form && alertBox){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const data=Object.fromEntries(new FormData(form).entries());
      if(!data.name||!data.email||!data.date||!data.time||!data.service){
        alertBox.className='error'; alertBox.textContent='Please fill all required fields.'; return;
      }
      saveBooking(data);
      const ics=makeICS(data);
      const blob=new Blob([ics],{type:'text/calendar'});
      const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='LE-Law-Consultation.ics'; a.click();
      alertBox.className='success'; alertBox.textContent='Reservation captured. A calendar invite (.ics) was downloaded.';
      form.reset();
    });
  }
  const table=document.querySelector('#booking-table-body');
  if(table){
    const list=JSON.parse(localStorage.getItem('bookings')||'[]');
    for(const b of list){
      const tr=document.createElement('tr');
      tr.innerHTML=`<td>${b.name}</td><td>${b.email}</td><td>${b.service}</td><td>${b.date} ${b.time}</td>`;
      table.appendChild(tr);
    }
  }
});