const { pgPool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class EventStore {
  async saveEvent(aggregateId, eventType, eventData, version = 1) {
    const client = await pgPool.connect();
    try {
      const query = `
        INSERT INTO events (id, aggregate_id, event_type, event_data, version)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      
      const values = [
        uuidv4(),
        aggregateId,
        eventType,
        JSON.stringify(eventData),
        version
      ];
      
      const result = await client.query(query, values);
      console.log(`Evento salvo: ${eventType} para aggregate ${aggregateId}`);
      
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getEventsByAggregateId(aggregateId) {
    const client = await pgPool.connect();
    try {
      const query = `
        SELECT * FROM events 
        WHERE aggregate_id = $1 
        ORDER BY version ASC, created_at ASC
      `;
      
      const result = await client.query(query, [aggregateId]);
      return result.rows.map(row => ({
        ...row,
        event_data: JSON.parse(row.event_data)
      }));
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getAllEvents() {
    const client = await pgPool.connect();
    try {
      const query = `
        SELECT * FROM events 
        ORDER BY created_at ASC
      `;
      
      const result = await client.query(query);
      return result.rows.map(row => ({
        ...row,
        event_data: JSON.parse(row.event_data)
      }));
    } catch (error) {
      console.error('Erro ao buscar todos os eventos:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getLatestVersion(aggregateId) {
    const client = await pgPool.connect();
    try {
      const query = `
        SELECT MAX(version) as max_version 
        FROM events 
        WHERE aggregate_id = $1
      `;
      
      const result = await client.query(query, [aggregateId]);
      return result.rows[0]?.max_version || 0;
    } catch (error) {
      console.error('Erro ao buscar versão mais recente:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new EventStore(); 